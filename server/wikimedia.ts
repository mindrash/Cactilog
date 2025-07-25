import { SpeciesImage } from "@shared/schema";

export interface WikimediaImage {
  url: string;
  title: string;
  description: string;
  attribution: string;
  sourceUrl: string;
  license: string;
  width: number;
  height: number;
}

export interface WikimediaSearchResult {
  images: WikimediaImage[];
  hasMore: boolean;
}

// Wikimedia Commons API client for fetching cactus images
export class WikimediaImageService {
  private readonly baseUrl = 'https://commons.wikimedia.org/w/api.php';
  private readonly maxResults = 10;

  // Search for images by genus and species
  async searchSpeciesImages(genus: string, species: string): Promise<WikimediaSearchResult> {
    try {
      // Search terms in order of preference
      const searchTerms = [
        `${genus} ${species}`,
        `${genus.toLowerCase()} ${species.toLowerCase()}`,
        genus
      ];

      for (const searchTerm of searchTerms) {
        const result = await this.performSearch(searchTerm);
        if (result.images.length > 0) {
          return result;
        }
      }

      return { images: [], hasMore: false };
    } catch (error) {
      console.error('Error searching Wikimedia:', error);
      return { images: [], hasMore: false };
    }
  }

  private async performSearch(searchTerm: string): Promise<WikimediaSearchResult> {
    console.log(`🔍 Searching Wikimedia for: "${searchTerm}"`);
    
    // Step 1: Search for files
    const searchParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      list: 'search',
      srsearch: searchTerm,
      srnamespace: '6', // File namespace
      srlimit: this.maxResults.toString(),
      srprop: 'title|snippet|size'
    });

    const searchUrl = `${this.baseUrl}?${searchParams}`;
    console.log(`📡 API call: ${searchUrl}`);
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    console.log(`📊 Search returned ${searchData.query?.search?.length || 0} results`);

    if (!searchData.query?.search?.length) {
      return { images: [], hasMore: false };
    }

    // Step 2: Get detailed file information
    const fileTitles = searchData.query.search
      .map((item: any) => item.title)
      .slice(0, this.maxResults);

    const fileParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: fileTitles.join('|'),
      prop: 'imageinfo|categories',
      iiprop: 'url|size|extmetadata',
      iiurlwidth: '800' // Thumbnail size
    });

    const fileResponse = await fetch(`${this.baseUrl}?${fileParams}`);
    const fileData = await fileResponse.json();

    const images: WikimediaImage[] = [];
    
    if (fileData.query?.pages) {
      for (const page of Object.values(fileData.query.pages) as any[]) {
        if (page.imageinfo?.[0]) {
          const imageInfo = page.imageinfo[0];
          const extMetadata = imageInfo.extmetadata || {};
          
          // Filter out inappropriate images
          if (this.isAppropriateImage(page.title, extMetadata)) {
            images.push({
              url: imageInfo.thumburl || imageInfo.url,
              title: page.title.replace('File:', ''),
              description: extMetadata.ImageDescription?.value || '',
              attribution: this.extractAttribution(extMetadata),
              sourceUrl: imageInfo.descriptionurl,
              license: extMetadata.LicenseShortName?.value || 'Unknown',
              width: imageInfo.thumbwidth || imageInfo.width,
              height: imageInfo.thumbheight || imageInfo.height
            });
          }
        }
      }
    }

    return {
      images: images.slice(0, this.maxResults),
      hasMore: searchData.query.searchinfo?.totalhits > this.maxResults
    };
  }

  private isAppropriateImage(title: string, extMetadata: any): boolean {
    const lowerTitle = title.toLowerCase();
    
    // Exclude inappropriate content
    const excludeTerms = ['logo', 'icon', 'symbol', 'cartoon'];
    if (excludeTerms.some(term => lowerTitle.includes(term))) {
      console.log(`❌ Excluded image (inappropriate): ${title}`);
      return false;
    }

    // Accept most image files - be less restrictive
    const isImageFile = lowerTitle.includes('.jpg') || lowerTitle.includes('.jpeg') || lowerTitle.includes('.png');
    if (isImageFile) {
      console.log(`✅ Accepted image: ${title}`);
      return true;
    }
    
    console.log(`⚠️  Skipped non-image: ${title}`);
    return false;
  }

  private extractAttribution(extMetadata: any): string {
    const artist = extMetadata.Artist?.value;
    const credit = extMetadata.Credit?.value;
    const source = extMetadata.Source?.value;

    if (artist) {
      // Clean HTML tags from artist field
      return artist.replace(/<[^>]*>/g, '').trim();
    }
    if (credit) {
      return credit.replace(/<[^>]*>/g, '').trim();
    }
    if (source) {
      return source.replace(/<[^>]*>/g, '').trim();
    }
    
    return 'Wikimedia Commons';
  }
}

// Service for managing species images in database
export class SpeciesImageService {
  private wikimedia = new WikimediaImageService();

  // Fetch and store images for a species
  async fetchAndStoreImages(genus: string, species: string, userId: string | null): Promise<SpeciesImage[]> {
    const searchResult = await this.wikimedia.searchSpeciesImages(genus, species);
    const storedImages: SpeciesImage[] = [];

    for (let index = 0; index < searchResult.images.length; index++) {
      const image = searchResult.images[index];
      const speciesImage: SpeciesImage = {
        id: crypto.randomUUID(), // Generate unique ID
        genus,
        species,
        imageUrl: image.url,
        imageSource: 'wikimedia',
        sourceAttribution: image.attribution,
        sourceUrl: image.sourceUrl,
        imageType: 'photograph',
        isPrimary: index === 0, // First image is primary
        uploadedBy: userId || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      storedImages.push(speciesImage);
    }

    return storedImages;
  }
}