--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (165f042)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: neondb_owner
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: neondb_owner
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: neondb_owner
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.admin_users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    email character varying NOT NULL,
    role character varying DEFAULT 'admin'::character varying NOT NULL,
    permissions jsonb DEFAULT '{"manage_users": false, "manage_images": true, "review_reports": true}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.admin_users OWNER TO neondb_owner;

--
-- Name: articles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.articles (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title character varying(200) NOT NULL,
    slug character varying(220) NOT NULL,
    status character varying DEFAULT 'draft'::character varying NOT NULL,
    tags text[],
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    published_at timestamp without time zone,
    category character varying(100),
    author character varying(100),
    meta_title character varying(200),
    meta_description character varying(300),
    sections jsonb NOT NULL,
    inline_styles text
);


ALTER TABLE public.articles OWNER TO neondb_owner;

--
-- Name: growth_records; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.growth_records (
    id integer NOT NULL,
    plant_id integer NOT NULL,
    date date NOT NULL,
    height_inches numeric(5,2),
    width_inches numeric(5,2),
    weight_oz numeric(6,2),
    observations text,
    created_at timestamp without time zone DEFAULT now(),
    circumference_inches numeric(5,2),
    offset_count integer DEFAULT 0,
    health_score integer,
    flowering_status character varying,
    environmental_notes text
);


ALTER TABLE public.growth_records OWNER TO neondb_owner;

--
-- Name: growth_records_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.growth_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.growth_records_id_seq OWNER TO neondb_owner;

--
-- Name: growth_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.growth_records_id_seq OWNED BY public.growth_records.id;


--
-- Name: photo_reports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.photo_reports (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    image_id character varying NOT NULL,
    reporter_user_id character varying,
    reporter_email character varying,
    report_type character varying NOT NULL,
    description character varying(1000),
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    admin_notes character varying(1000),
    reviewed_by character varying,
    reviewed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.photo_reports OWNER TO neondb_owner;

--
-- Name: plant_likes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.plant_likes (
    id integer NOT NULL,
    plant_id integer NOT NULL,
    user_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.plant_likes OWNER TO neondb_owner;

--
-- Name: plant_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.plant_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plant_likes_id_seq OWNER TO neondb_owner;

--
-- Name: plant_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.plant_likes_id_seq OWNED BY public.plant_likes.id;


--
-- Name: plant_photos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.plant_photos (
    id integer NOT NULL,
    plant_id integer NOT NULL,
    filename character varying NOT NULL,
    original_name character varying,
    mime_type character varying,
    size integer,
    uploaded_at timestamp without time zone DEFAULT now(),
    file_path character varying,
    image_data text
);


ALTER TABLE public.plant_photos OWNER TO neondb_owner;

--
-- Name: plant_photos_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.plant_photos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plant_photos_id_seq OWNER TO neondb_owner;

--
-- Name: plant_photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.plant_photos_id_seq OWNED BY public.plant_photos.id;


--
-- Name: plants; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.plants (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    custom_id character varying,
    genus character varying NOT NULL,
    species character varying,
    cultivar character varying,
    mutation character varying,
    common_name character varying,
    supplier character varying,
    acquisition_date date,
    initial_type character varying,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_public character varying DEFAULT 'public'::character varying NOT NULL,
    family character varying NOT NULL
);


ALTER TABLE public.plants OWNER TO neondb_owner;

--
-- Name: plants_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.plants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plants_id_seq OWNER TO neondb_owner;

--
-- Name: plants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.plants_id_seq OWNED BY public.plants.id;


--
-- Name: seeds; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.seeds (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    custom_id character varying,
    genus character varying NOT NULL,
    species character varying,
    cultivar character varying,
    mutation character varying,
    common_name character varying,
    supplier character varying,
    sow_date date,
    quantity integer,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    family character varying NOT NULL
);


ALTER TABLE public.seeds OWNER TO neondb_owner;

--
-- Name: seeds_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.seeds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seeds_id_seq OWNER TO neondb_owner;

--
-- Name: seeds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.seeds_id_seq OWNED BY public.seeds.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: species_images; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.species_images (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    genus character varying NOT NULL,
    species character varying NOT NULL,
    image_url character varying NOT NULL,
    image_source character varying NOT NULL,
    source_attribution character varying,
    source_url character varying,
    image_type character varying DEFAULT 'photograph'::character varying NOT NULL,
    is_primary boolean DEFAULT false,
    uploaded_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.species_images OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    auth_provider character varying,
    collection_public character varying DEFAULT 'public'::character varying,
    contribute_photos_to_knowledge_base boolean DEFAULT true,
    display_name character varying(20)
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: vendors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text,
    website character varying,
    location character varying,
    specialties text[],
    categories text[],
    reputation character varying DEFAULT 'reliable'::character varying,
    shipping_info text,
    price_range character varying DEFAULT 'moderate'::character varying,
    is_active boolean DEFAULT true,
    verified_date timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.vendors OWNER TO neondb_owner;

--
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendors_id_seq OWNER TO neondb_owner;

--
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: neondb_owner
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: growth_records id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.growth_records ALTER COLUMN id SET DEFAULT nextval('public.growth_records_id_seq'::regclass);


--
-- Name: plant_likes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plant_likes ALTER COLUMN id SET DEFAULT nextval('public.plant_likes_id_seq'::regclass);


--
-- Name: plant_photos id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plant_photos ALTER COLUMN id SET DEFAULT nextval('public.plant_photos_id_seq'::regclass);


--
-- Name: plants id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plants ALTER COLUMN id SET DEFAULT nextval('public.plants_id_seq'::regclass);


--
-- Name: seeds id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.seeds ALTER COLUMN id SET DEFAULT nextval('public.seeds_id_seq'::regclass);


--
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: neondb_owner
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_email_unique UNIQUE (email);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: articles articles_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_slug_unique UNIQUE (slug);


--
-- Name: growth_records growth_records_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.growth_records
    ADD CONSTRAINT growth_records_pkey PRIMARY KEY (id);


--
-- Name: photo_reports photo_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photo_reports
    ADD CONSTRAINT photo_reports_pkey PRIMARY KEY (id);


--
-- Name: plant_likes plant_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plant_likes
    ADD CONSTRAINT plant_likes_pkey PRIMARY KEY (id);


--
-- Name: plant_photos plant_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plant_photos
    ADD CONSTRAINT plant_photos_pkey PRIMARY KEY (id);


--
-- Name: plants plants_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.plants
    ADD CONSTRAINT plants_pkey PRIMARY KEY (id);


--
-- Name: seeds seeds_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.seeds
    ADD CONSTRAINT seeds_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: species_images species_images_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.species_images
    ADD CONSTRAINT species_images_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: articles_slug_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX articles_slug_idx ON public.articles USING btree (slug);


--
-- Name: articles_status_published_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX articles_status_published_at_idx ON public.articles USING btree (status, published_at);


--
-- Name: unique_user_plant_like; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX unique_user_plant_like ON public.plant_likes USING btree (user_id, plant_id);


--
-- Name: admin_users admin_users_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: photo_reports photo_reports_image_id_species_images_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photo_reports
    ADD CONSTRAINT photo_reports_image_id_species_images_id_fk FOREIGN KEY (image_id) REFERENCES public.species_images(id);


--
-- Name: photo_reports photo_reports_reporter_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photo_reports
    ADD CONSTRAINT photo_reports_reporter_user_id_users_id_fk FOREIGN KEY (reporter_user_id) REFERENCES public.users(id);


--
-- Name: photo_reports photo_reports_reviewed_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photo_reports
    ADD CONSTRAINT photo_reports_reviewed_by_users_id_fk FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- Name: species_images species_images_uploaded_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.species_images
    ADD CONSTRAINT species_images_uploaded_by_users_id_fk FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

