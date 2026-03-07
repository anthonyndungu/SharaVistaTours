--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2026-03-06 01:33:10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 876 (class 1247 OID 714686)
-- Name: enum_bookings_payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_bookings_payment_status AS ENUM (
    'unpaid',
    'pending',
    'paid',
    'refunded'
);


ALTER TYPE public.enum_bookings_payment_status OWNER TO postgres;

--
-- TOC entry 873 (class 1247 OID 714676)
-- Name: enum_bookings_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_bookings_status AS ENUM (
    'pending',
    'confirmed',
    'cancelled',
    'completed'
);


ALTER TYPE public.enum_bookings_status OWNER TO postgres;

--
-- TOC entry 900 (class 1247 OID 878581)
-- Name: enum_c2b_payments_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_c2b_payments_status AS ENUM (
    'completed',
    'unmatched',
    'failed'
);


ALTER TYPE public.enum_c2b_payments_status OWNER TO postgres;

--
-- TOC entry 906 (class 1247 OID 878611)
-- Name: enum_expected_payments_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_expected_payments_status AS ENUM (
    'pending',
    'matched',
    'expired',
    'failed'
);


ALTER TYPE public.enum_expected_payments_status OWNER TO postgres;

--
-- TOC entry 885 (class 1247 OID 714728)
-- Name: enum_payments_payment_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_payments_payment_method AS ENUM (
    'mpesa',
    'card',
    'bank_transfer'
);


ALTER TYPE public.enum_payments_payment_method OWNER TO postgres;

--
-- TOC entry 888 (class 1247 OID 714736)
-- Name: enum_payments_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_payments_status AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded'
);


ALTER TYPE public.enum_payments_status OWNER TO postgres;

--
-- TOC entry 861 (class 1247 OID 714623)
-- Name: enum_tour_packages_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_tour_packages_category AS ENUM (
    'adventure',
    'cultural',
    'beach',
    'wildlife',
    'luxury',
    'budget',
    'family',
    'honeymoon'
);


ALTER TYPE public.enum_tour_packages_category OWNER TO postgres;

--
-- TOC entry 864 (class 1247 OID 714640)
-- Name: enum_tour_packages_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_tour_packages_status AS ENUM (
    'draft',
    'published',
    'archived'
);


ALTER TYPE public.enum_tour_packages_status OWNER TO postgres;

--
-- TOC entry 855 (class 1247 OID 714604)
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'client',
    'admin',
    'super_admin'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 715276)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 714714)
-- Name: booking_passengers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_passengers (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255),
    phone character varying(255),
    age integer,
    passport_number character varying(255),
    nationality character varying(255) DEFAULT 'Kenyan'::character varying,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    booking_id uuid
);


ALTER TABLE public.booking_passengers OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 714693)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id uuid NOT NULL,
    booking_number character varying(255) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status public.enum_bookings_status DEFAULT 'pending'::public.enum_bookings_status,
    payment_status public.enum_bookings_payment_status DEFAULT 'unpaid'::public.enum_bookings_payment_status,
    special_requests text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid,
    package_id uuid
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 878587)
-- Name: c2b_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.c2b_payments (
    id uuid NOT NULL,
    trans_id character varying(100) NOT NULL,
    trans_type character varying(50),
    trans_time bigint,
    trans_amount numeric(10,2) NOT NULL,
    business_shortcode character varying(20),
    msisdn character varying(20),
    first_name character varying(100),
    last_name character varying(100),
    account_number character varying(100),
    org_account_balance numeric(10,2),
    booking_id uuid,
    status public.enum_c2b_payments_status DEFAULT 'completed'::public.enum_c2b_payments_status,
    match_confidence character varying(20),
    raw_callback jsonb,
    processed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid
);


ALTER TABLE public.c2b_payments OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 878619)
-- Name: expected_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expected_payments (
    id uuid NOT NULL,
    phone character varying(20) NOT NULL,
    amount numeric(10,2) NOT NULL,
    booking_id uuid,
    status public.enum_expected_payments_status DEFAULT 'pending'::public.enum_expected_payments_status,
    expires_at timestamp with time zone,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid
);


ALTER TABLE public.expected_payments OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 714662)
-- Name: package_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.package_images (
    id uuid NOT NULL,
    url character varying(255) NOT NULL,
    is_primary boolean DEFAULT false,
    caption character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    tour_package_id uuid
);


ALTER TABLE public.package_images OWNER TO postgres;

--
-- TOC entry 6637 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN package_images.url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.package_images.url IS 'Local file path stored by Multer';


--
-- TOC entry 224 (class 1259 OID 871451)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    booking_id uuid NOT NULL,
    payment_method public.enum_payments_payment_method NOT NULL,
    transaction_id character varying(255),
    amount numeric(10,2) NOT NULL,
    currency character varying(255) DEFAULT 'KES'::character varying,
    status public.enum_payments_status DEFAULT 'pending'::public.enum_payments_status,
    stripe_payment_intent_id character varying(255),
    stripe_charge_id character varying(255),
    card_last4 character varying(4),
    card_brand character varying(255),
    mpesa_checkout_request_id character varying(255),
    mpesa_merchant_request_id character varying(255),
    mpesa_result_code integer,
    mpesa_result_desc character varying(255),
    paid_at timestamp with time zone,
    refunded_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    mpesa_amount numeric(10,2),
    mpesa_phone character varying(255),
    mpesa_transaction_date bigint,
    mpesa_balance numeric(10,2)
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 714761)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid NOT NULL,
    rating integer NOT NULL,
    comment text NOT NULL,
    is_verified_booking boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid,
    package_id uuid
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 714647)
-- Name: tour_packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tour_packages (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    destination character varying(255) NOT NULL,
    duration_days integer NOT NULL,
    duration_nights integer,
    itinerary json DEFAULT '[]'::json,
    category public.enum_tour_packages_category DEFAULT 'adventure'::public.enum_tour_packages_category NOT NULL,
    price_adult numeric(10,2) NOT NULL,
    price_child numeric(10,2) DEFAULT 0 NOT NULL,
    discount_price numeric(10,2),
    max_capacity integer DEFAULT 20,
    cover_image character varying(255),
    is_featured boolean DEFAULT false,
    status public.enum_tour_packages_status DEFAULT 'published'::public.enum_tour_packages_status,
    inclusions json DEFAULT '[]'::json,
    exclusions json DEFAULT '[]'::json,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    location character varying(255)
);


ALTER TABLE public.tour_packages OWNER TO postgres;

--
-- TOC entry 6638 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN tour_packages.destination; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tour_packages.destination IS 'Broad region or country (e.g., "Kenya", "Tanzania")';


--
-- TOC entry 6639 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN tour_packages.duration_nights; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tour_packages.duration_nights IS 'Number of nights. If null, usually duration_days - 1';


--
-- TOC entry 6640 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN tour_packages.itinerary; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tour_packages.itinerary IS 'Array of objects: [{ day: 1, title: "...", description: "...", activities: [] }]';


--
-- TOC entry 6641 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN tour_packages.discount_price; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tour_packages.discount_price IS 'Optional discounted price for adults';


--
-- TOC entry 6642 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN tour_packages.cover_image; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tour_packages.cover_image IS 'Path to the primary package image (legacy support)';


--
-- TOC entry 6643 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN tour_packages.inclusions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tour_packages.inclusions IS 'Array of strings: ["Accommodation", "Meals", ...]';


--
-- TOC entry 6644 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN tour_packages.exclusions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tour_packages.exclusions IS 'Array of strings: ["Flights", "Visa", ...]';


--
-- TOC entry 6645 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN tour_packages.location; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tour_packages.location IS 'Starting point or specific location of the tour';


--
-- TOC entry 217 (class 1259 OID 714611)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_users_role DEFAULT 'client'::public.enum_users_role NOT NULL,
    profile_picture character varying(255),
    is_verified boolean DEFAULT false,
    password_changed_at timestamp with time zone,
    password_reset_token character varying(255),
    password_reset_expires timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 6628 (class 0 OID 715276)
-- Dependencies: 223
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20260228120143-change-location-to-jsonb.js
\.


--
-- TOC entry 6626 (class 0 OID 714714)
-- Dependencies: 221
-- Data for Name: booking_passengers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking_passengers (id, name, email, phone, age, passport_number, nationality, created_at, updated_at, deleted_at, booking_id) FROM stdin;
24ee2df6-7d88-417a-b568-7d57cc920ba9	John Doe	john@example.com	0723456789	\N		Kenyan	2026-03-02 11:58:03.548+03	2026-03-02 11:58:03.548+03	\N	7c6a758b-01dd-4ed8-8e3a-9401cd4e87fd
8acf51a6-2381-46b4-8504-055ef4e9129a	John Doe	john@example.com	0723456789	\N		Kenyan	2026-03-02 14:53:17.586+03	2026-03-02 14:53:17.586+03	\N	50a9d1da-fb8e-4347-b521-46993bc95532
7ae7653e-75ab-4b86-b525-d7315f0c31e5	John Doe	john@example.com	0723456789	\N		Kenyan	2026-03-02 17:59:46.267+03	2026-03-02 17:59:46.267+03	\N	ac35c252-ab43-4c87-a061-721642de8749
a1b3a95c-d155-4511-a021-e3cd39845de5	John Doe	john@example.com	0723456789	\N		Kenyan	2026-03-02 21:30:27.668+03	2026-03-02 21:30:27.668+03	\N	82209ed1-c7fa-4f50-ae41-7acda2eb1753
098f3fe2-46e4-45b4-aa7e-1350c608f2c5	John Doe	john@example.com	0723456789	\N		Kenyan	2026-03-02 22:31:14.574+03	2026-03-02 22:31:14.574+03	\N	3a65f66b-fe40-4954-a2d6-5e1dbbfa9160
\.


--
-- TOC entry 6625 (class 0 OID 714693)
-- Dependencies: 220
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, booking_number, start_date, end_date, total_amount, status, payment_status, special_requests, created_at, updated_at, deleted_at, user_id, package_id) FROM stdin;
7c6a758b-01dd-4ed8-8e3a-9401cd4e87fd	BK268835029898	2026-03-13	2026-03-15	8000.00	pending	unpaid	\N	2026-03-02 11:58:03.515+03	2026-03-02 11:58:03.515+03	\N	1deeef79-4f7a-4f68-8392-0e08b375eb0d	1b6e3700-725c-4401-b5a6-4e51d0fd556d
50a9d1da-fb8e-4347-b521-46993bc95532	BK263975111024	2026-03-20	2026-03-22	8000.00	pending	unpaid	\N	2026-03-02 14:53:17.526+03	2026-03-02 14:53:17.526+03	\N	1deeef79-4f7a-4f68-8392-0e08b375eb0d	1b6e3700-725c-4401-b5a6-4e51d0fd556d
82209ed1-c7fa-4f50-ae41-7acda2eb1753	BK262276113069	2026-03-06	2026-03-14	85000.00	pending	pending	\N	2026-03-02 21:30:27.618+03	2026-03-02 21:33:19.201+03	\N	1deeef79-4f7a-4f68-8392-0e08b375eb0d	adb258f0-aebf-4fe9-a2dd-84296535639d
ac35c252-ab43-4c87-a061-721642de8749	BK265862178588	2026-03-13	2026-03-15	8000.00	cancelled	pending	\N	2026-03-02 17:59:46.23+03	2026-03-02 22:56:23.707+03	\N	1deeef79-4f7a-4f68-8392-0e08b375eb0d	1b6e3700-725c-4401-b5a6-4e51d0fd556d
3a65f66b-fe40-4954-a2d6-5e1dbbfa9160	BK268745362557	2026-03-06	2026-03-08	1.00	confirmed	paid	\N	2026-03-02 22:31:14.55+03	2026-03-04 19:25:27.131+03	\N	1deeef79-4f7a-4f68-8392-0e08b375eb0d	e15e0455-6efd-4097-87a4-88d0acfbaca2
\.


--
-- TOC entry 6630 (class 0 OID 878587)
-- Dependencies: 225
-- Data for Name: c2b_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.c2b_payments (id, trans_id, trans_type, trans_time, trans_amount, business_shortcode, msisdn, first_name, last_name, account_number, org_account_balance, booking_id, status, match_confidence, raw_callback, processed_at, created_at, updated_at, deleted_at, user_id) FROM stdin;
ba1d62e7-b1bb-4dc3-9dd3-1a5295122ba2	C2B_1772717364007_3FDGUN	PayBill	1772717364007	85000.00	123456	254793720489	\N	\N	BK262276113069	0.00	82209ed1-c7fa-4f50-ae41-7acda2eb1753	completed	high	{"expiresAt": "2026-03-05T13:44:24.007Z", "initiated_at": "2026-03-05T13:29:24.007Z", "initiated_by": "1deeef79-4f7a-4f68-8392-0e08b375eb0d", "instructions": "Go to Lipa na M-Pesa → PayBill → Enter 123456 → Account: BK262276113069 → Amount: 85000 → Enter PIN", "booking_number": "BK262276113069"}	2026-03-05 16:29:24.008+03	2026-03-05 16:29:24.012+03	2026-03-05 16:29:24.012+03	\N	\N
\.


--
-- TOC entry 6631 (class 0 OID 878619)
-- Dependencies: 226
-- Data for Name: expected_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expected_payments (id, phone, amount, booking_id, status, expires_at, metadata, created_at, updated_at, deleted_at, user_id) FROM stdin;
\.


--
-- TOC entry 6624 (class 0 OID 714662)
-- Dependencies: 219
-- Data for Name: package_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.package_images (id, url, is_primary, caption, created_at, updated_at, deleted_at, tour_package_id) FROM stdin;
d29cea53-99e8-41db-a8f5-3c8caba439bd	packages/pkg-1772623842957-361364332.jpg	t		2026-03-04 14:30:43.122+03	2026-03-04 14:30:43.122+03	\N	e945edd3-43bf-4706-8e5c-ff1448fc1fb2
1ee507bd-a432-449f-ae84-bf64946de97e	packages/pkg-1772623842973-910497658.jpg	t		2026-03-04 14:30:43.122+03	2026-03-04 14:30:43.122+03	\N	e945edd3-43bf-4706-8e5c-ff1448fc1fb2
6cadb21e-8869-42cf-aeec-83929373f060	packages/pkg-1772623842987-770499163.jpg	t		2026-03-04 14:30:43.122+03	2026-03-04 14:30:43.122+03	\N	e945edd3-43bf-4706-8e5c-ff1448fc1fb2
6fbb6027-5a3f-42e7-a59e-9f0dd7c722c0	packages/pkg-1772623843002-43833036.jpg	t		2026-03-04 14:30:43.122+03	2026-03-04 14:30:43.122+03	\N	e945edd3-43bf-4706-8e5c-ff1448fc1fb2
1985d95e-55b2-40f3-9909-92e07f79d136	packages/pkg-1772623843021-393747648.jpg	t		2026-03-04 14:30:43.122+03	2026-03-04 14:30:43.122+03	\N	e945edd3-43bf-4706-8e5c-ff1448fc1fb2
0627f6c2-a5ee-4c09-a5de-963b9879f28c	packages/pkg-1772623843037-614305013.jpg	t		2026-03-04 14:30:43.122+03	2026-03-04 14:30:43.122+03	\N	e945edd3-43bf-4706-8e5c-ff1448fc1fb2
50f72c56-1c4e-4d0c-8a07-0a0f54057041	packages/pkg-1772623914212-332234463.jpg	t		2026-03-04 14:31:54.273+03	2026-03-04 14:31:54.273+03	\N	1b6e3700-725c-4401-b5a6-4e51d0fd556d
66d34fb1-3477-47e6-8ed1-083e38a234e4	packages/pkg-1772623914213-342587784.jpg	t		2026-03-04 14:31:54.273+03	2026-03-04 14:31:54.273+03	\N	1b6e3700-725c-4401-b5a6-4e51d0fd556d
49e0622f-1a9d-420a-b0d2-b79a1406c518	packages/pkg-1772623971284-67308197.jpg	t		2026-03-04 14:32:51.371+03	2026-03-04 14:32:51.371+03	\N	adb258f0-aebf-4fe9-a2dd-84296535639d
90eb341e-5460-4619-9b9f-b20077975542	packages/pkg-1772624061867-914322149.jpg	t		2026-03-04 14:34:22.038+03	2026-03-04 14:34:22.038+03	\N	46ac5952-e9c5-41e7-b4ae-f9df7a174faa
6af4343c-9641-45d3-ad64-d454d8972926	packages/pkg-1772624129587-283414758.jpg	t		2026-03-04 14:35:29.696+03	2026-03-04 14:35:29.696+03	\N	170c5ce0-daef-46ec-9d53-2678b9a00913
a3f3c598-ef12-4920-94ae-3ee8ff6820d6	packages/pkg-1772624157246-790049840.jpg	t		2026-03-04 14:35:57.455+03	2026-03-04 14:35:57.455+03	\N	7d2ff56d-6c74-4083-9401-370f4958d808
89e8dd48-a2dd-4360-83fe-bb3545af5246	packages/pkg-1772624031669-924677928.jpg	t		2026-03-04 14:33:51.727+03	2026-03-04 14:33:51.727+03	2026-03-04 15:01:08.513+03	e15e0455-6efd-4097-87a4-88d0acfbaca2
65898470-1fe0-4f9d-8475-b50d554c7547	packages/pkg-1772625820216-713752851.jpg	t		2026-03-04 15:03:40.294+03	2026-03-04 15:03:40.294+03	\N	e15e0455-6efd-4097-87a4-88d0acfbaca2
\.


--
-- TOC entry 6629 (class 0 OID 871451)
-- Dependencies: 224
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, booking_id, payment_method, transaction_id, amount, currency, status, stripe_payment_intent_id, stripe_charge_id, card_last4, card_brand, mpesa_checkout_request_id, mpesa_merchant_request_id, mpesa_result_code, mpesa_result_desc, paid_at, refunded_at, created_at, updated_at, deleted_at, mpesa_amount, mpesa_phone, mpesa_transaction_date, mpesa_balance) FROM stdin;
16fd8ae0-1b20-47d3-a2b9-3dbb565b7154	82209ed1-c7fa-4f50-ae41-7acda2eb1753	mpesa	ws_CO_04032026202319525793720489	85000.00	KES	pending	\N	\N	\N	\N	ws_CO_04032026202319525793720489	69c1-414d-8eed-6685de7caee04779	\N	\N	\N	\N	2026-03-04 20:23:21.295+03	2026-03-04 20:23:21.295+03	\N	\N	\N	\N	\N
c57b23f7-fc5b-49b0-9beb-ce99e266013e	82209ed1-c7fa-4f50-ae41-7acda2eb1753	mpesa	ws_CO_04032026203529746793720489	85000.00	KES	pending	\N	\N	\N	\N	ws_CO_04032026203529746793720489	69c1-414d-8eed-6685de7caee04958	\N	\N	\N	\N	2026-03-04 20:35:32.648+03	2026-03-04 20:35:32.648+03	\N	\N	\N	\N	\N
ccc6099b-2570-4e17-8fdd-3823dc6c907c	82209ed1-c7fa-4f50-ae41-7acda2eb1753	mpesa	ws_CO_05032026140852037793720489	85000.00	KES	pending	\N	\N	\N	\N	ws_CO_05032026140852037793720489	a55b-4b71-a2f1-9a6a0fbda1ca3951	\N	\N	\N	\N	2026-03-05 14:08:53.395+03	2026-03-05 14:08:53.395+03	\N	\N	\N	\N	\N
60e7ddba-370e-4745-a2bb-6f9ae2b60882	82209ed1-c7fa-4f50-ae41-7acda2eb1753	mpesa	ws_CO_05032026174842179793720489	85000.00	KES	pending	\N	\N	\N	\N	ws_CO_05032026174842179793720489	4b35-428f-91a0-cda956f46396804	\N	\N	\N	\N	2026-03-05 17:48:44.832+03	2026-03-05 17:48:44.832+03	\N	\N	\N	\N	\N
\.


--
-- TOC entry 6627 (class 0 OID 714761)
-- Dependencies: 222
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, rating, comment, is_verified_booking, created_at, updated_at, deleted_at, user_id, package_id) FROM stdin;
479cc61a-1c91-43d0-abe4-f7f288c0bf12	5	Absolutely amazing safari experience! Saw all the Big Five and the guides were incredibly knowledgeable.	t	2026-02-28 14:18:12.135+03	2026-02-28 14:18:12.135+03	\N	1deeef79-4f7a-4f68-8392-0e08b375eb0d	7d2ff56d-6c74-4083-9401-370f4958d808
6c048b83-3ae6-4035-81e0-67b63b495607	4	Beautiful beach and great service. Would definitely recommend for a relaxing getaway.	t	2026-02-28 14:18:12.135+03	2026-02-28 14:18:12.135+03	\N	1deeef79-4f7a-4f68-8392-0e08b375eb0d	170c5ce0-daef-46ec-9d53-2678b9a00913
5963c424-9652-45f8-9a8b-759f4f125556	5	Challenging but rewarding climb. The views from the top were breathtaking!	f	2026-02-28 14:18:12.135+03	2026-02-28 14:18:12.135+03	\N	3ece1fc5-b3d2-47de-9f77-9925f21de710	46ac5952-e9c5-41e7-b4ae-f9df7a174faa
6613ba4f-32ad-4056-b273-13923af13957	5	Fascinating cultural experience. The history and architecture of Lamu are incredible.	t	2026-02-28 14:18:12.135+03	2026-02-28 14:18:12.135+03	\N	1deeef79-4f7a-4f68-8392-0e08b375eb0d	e15e0455-6efd-4097-87a4-88d0acfbaca2
2271dac6-995e-4015-a66a-aa6a3020a239	5	Luxury at its finest! The views of Kilimanjaro and the elephant herds were unforgettable.	f	2026-02-28 14:18:12.135+03	2026-02-28 14:18:12.135+03	\N	3ece1fc5-b3d2-47de-9f77-9925f21de710	adb258f0-aebf-4fe9-a2dd-84296535639d
bb922452-ca11-4206-8744-26a2e8b8b19c	4	Great value for money. Perfect introduction to Nairobi for first-time visitors.	t	2026-02-28 14:18:12.135+03	2026-02-28 14:18:12.135+03	\N	1deeef79-4f7a-4f68-8392-0e08b375eb0d	1b6e3700-725c-4401-b5a6-4e51d0fd556d
\.


--
-- TOC entry 6623 (class 0 OID 714647)
-- Dependencies: 218
-- Data for Name: tour_packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tour_packages (id, title, description, destination, duration_days, duration_nights, itinerary, category, price_adult, price_child, discount_price, max_capacity, cover_image, is_featured, status, inclusions, exclusions, created_at, updated_at, deleted_at, location) FROM stdin;
46ac5952-e9c5-41e7-b4ae-f9df7a174faa	Mount Kenya Climbing Expedition	Challenge yourself with an unforgettable climb up Africa's second-highest mountain. Experience diverse ecosystems and breathtaking views.	Mount Kenya	6	5	["[object Object]","[object Object]","[object Object]","[object Object]","[object Object]","[object Object]"]	adventure	65000.00	0.00	\N	8	\N	f	published	["Professional guides","Mountain fees","Camping equipment","All meals","Transport"]	["Climbing gear rental","Travel insurance","Tips","Personal climbing equipment"]	2026-02-28 14:18:12.049+03	2026-03-04 14:34:21.896+03	\N	{"lat":-0.1712491304871965,"lng":37.35694962113493,"address":"Chogoria ward, Mwimbi, Tharaka-Nithi, Kenya"}
e15e0455-6efd-4097-87a4-88d0acfbaca2	Lamu Island Cultural Experience	Discover the rich Swahili culture and history of Lamu Old Town, a UNESCO World Heritage Site. Explore ancient architecture and pristine beaches.	Lamu Island	3	2	["Day 1: Arrive Paris","Day 2: Louvre Museum","Day 3: Montmartre Walking Tour"]	cultural	1.00	0.00	20000.00	15	\N	f	published	["Heritage hotel accommodation","All meals","Boat transfers","Cultural tours"]	["Flights","Travel insurance","Shopping","Optional activities"]	2026-02-28 14:18:12.059+03	2026-03-04 15:03:40.266+03	\N	{"lat":-2.1022427282944607,"lng":40.73448727238161,"address":"Kwa Bwana Keri, Hindi ward, Lamu West, Lamu, Kenya"}
199c2763-454e-4c2a-99df-645856848040	cdadadad	dadaaadadadaad	dadadad	3	2	["Day 1: Departure","Day 2: Board Vehicles"]	wildlife	2400.00	2100.00	\N	20	\N	f	published	["Accommodation","Drinks","Water"]	["Flight","Tips"]	2026-02-28 17:11:27.114+03	2026-02-28 21:35:08.514+03	2026-02-28 21:35:08.514+03	{"lat":-1.2821326578048682,"lng":36.845275051434285,"address":"Pumwani Maternity Hospital, General Waruingi Street, Majengo, Majengo sublocation, Pumwani ward, Kamukunji, Nairobi, Nairobi County, 13067, Kenya"}
e945edd3-43bf-4706-8e5c-ff1448fc1fb2	Lake Solai	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.	Solai	2	2	["Day 1: Arrival","Day 2: Departure","Day 3: Visit Masai Mara"]	wildlife	2300.00	2000.00	\N	20	\N	t	published	["Accommodation","Meals","Water"]	["Flight","Tips"]	2026-02-28 19:02:07.308+03	2026-03-04 14:30:43.094+03	\N	{"lat":0.11147897467148904,"lng":36.20665050782311,"address":"Giastaff, Solai ward, Rongai, Nakuru, Kenya"}
adb258f0-aebf-4fe9-a2dd-84296535639d	Luxury Amboseli Safari	Experience luxury camping with stunning views of Mount Kilimanjaro. Witness large elephant herds and enjoy premium safari experiences.	Amboseli National Park	4	3	["Day 1: Arrive Paris Check-in Hotel Dinner in Le Marais","Day 2: Louvre Museum Seine Cruise Eiffel Tower","Day 3: Montmartre Walking Tour","Shopping Departure"]	luxury	85000.00	65000.00	\N	6	\N	t	published	["Luxury tented camp","Gourmet meals","Private game drives","Park fees","Champagne sundowners"]	["Flights","Travel insurance","Tips","Spa treatments"]	2026-02-28 14:18:12.075+03	2026-03-04 14:32:51.353+03	\N	{"lat":-2.6186383366802986,"lng":37.17725551765838,"address":"Etonet/Lenkism ward, Loitokitok, Kajiado County, Kenya"}
170c5ce0-daef-46ec-9d53-2678b9a00913	Diani Beach Paradise Getaway	Relax on pristine white sand beaches with crystal-clear turquoise waters. Perfect for families and couples seeking sun, sea, and relaxation.	Diani Beach	4	3	["[object Object]","[object Object]","[object Object]","[object Object]"]	beach	28000.00	20000.00	\N	20	\N	t	published	["Beachfront accommodation","Breakfast & dinner","Airport transfers","Beach activities"]	["Lunch","Water sports","Spa treatments","Travel insurance"]	2026-02-28 14:18:12.025+03	2026-03-04 14:35:29.669+03	\N	{"lat":-4.262532330729128,"lng":39.57108495647711,"address":"Ukunda-Ramisi Road, Kona Ya Chale, Gombato Bongwe ward, Msambweni, Kwale, 80403, Kenya"}
7d2ff56d-6c74-4083-9401-370f4958d808	Maasai Mara Safari Adventure	Experience the ultimate wildlife safari in Kenya's most famous national reserve. Witness the Great Migration, spot the Big Five, and immerse yourself in Maasai culture.	Maasai Mara National Reserve	5	4	["[object Object]","[object Object]","[object Object]","[object Object]","[object Object]"]	wildlife	45000.00	35000.00	42000.00	12	\N	t	published	["Accommodation","All meals","Game drives","Park fees","Professional guide","Transport"]	["International flights","Travel insurance","Tips","Personal expenses"]	2026-02-28 14:18:12+03	2026-03-04 14:35:57.441+03	\N	{"lat":-1.4719282517966394,"lng":35.111028036405045,"address":"Siana ward, Narok West, Narok, 66601, Kenya"}
dfedf774-dd80-479b-ade6-fc8d007d5515	kcalklaklfdklfakkkq	lkalkafaklfl	klafflakflalkfalf	3	2	[]	wildlife	1300.00	0.00	\N	20	\N	f	published	[]	[]	2026-03-03 13:16:06.073+03	2026-03-04 13:46:59.245+03	2026-03-04 13:46:59.24+03	{"lat":-3.338552685621736,"lng":40.04868789932252,"address":"Lonno Lodge Road, Watamu ward, Kilifi North, Kilifi County, 80202, Kenya"}
1655ba5c-a68c-41d0-866b-2f5ab015f539	Test Package	lvsllslslsflsflskkkdlfldfkd	fkdfldlfdfd	4	3	["Day 1: Arrival","Day 2: Departure"]	wildlife	4500.00	3000.00	\N	20	\N	f	published	["Parking Fees","Meals"]	["Personal effects","Accommodation"]	2026-03-01 00:26:21.496+03	2026-03-04 13:47:04.702+03	2026-03-04 13:47:04.702+03	{"lat":-3.1023770431796125,"lng":40.19116664201295,"address":"Mambrui, Magarini ward, Magarini, Kilifi County, Kenya"}
1b6e3700-725c-4401-b5a6-4e51d0fd556d	Budget Nairobi City Tour	Explore Kenya's vibrant capital city on a budget-friendly tour. Visit museums, markets, and wildlife sanctuaries within the city.	Nairobi	2	1	["Day 1: Arrive Paris Check-in Hotel Dinner in Le Marais","Day 2: Louvre Museum Seine Cruise Eiffel Tower","Day 3: Montmartre Walking Tour","Shopping Departure"]	budget	8000.00	5000.00	\N	25	\N	f	published	["Hotel accommodation","Breakfast","City tour","Transport"]	["Lunch & dinner","Entrance fees to optional attractions","Personal expenses"]	2026-02-28 14:18:12.089+03	2026-03-04 14:31:54.25+03	\N	{"lat":-1.2893749437851647,"lng":36.81728836258424,"address":"Haile Selassie Exit, Kilimani location, Kilimani ward, Kilimani division, Westlands, Nairobi, Nairobi County, 40476, Kenya"}
\.


--
-- TOC entry 6622 (class 0 OID 714611)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, phone, password, role, profile_picture, is_verified, password_changed_at, password_reset_token, password_reset_expires, created_at, updated_at, deleted_at) FROM stdin;
3ece1fc5-b3d2-47de-9f77-9925f21de710	Admin User	admin@sharavista.com	0705048849	$2a$12$lvWWmacuxDH8Y7KvQa9lu.8sSYC6UbJjHKIx6Id8S1UmsXv3iMnTK	super_admin	\N	t	\N	\N	\N	2026-02-28 14:18:10.906+03	2026-02-28 14:18:10.906+03	\N
1deeef79-4f7a-4f68-8392-0e08b375eb0d	John Doe updated	john@example.com	0723456789	$2a$12$w0OjxkP.8RELXr9flXonHu0.XatEGtZl/7wBHOeHNc/n3BLw7nwVa	client	\N	t	\N	\N	\N	2026-02-28 14:18:11.504+03	2026-03-03 01:49:01.131+03	\N
\.


--
-- TOC entry 5923 (class 2606 OID 715280)
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 5919 (class 2606 OID 714721)
-- Name: booking_passengers booking_passengers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_passengers
    ADD CONSTRAINT booking_passengers_pkey PRIMARY KEY (id);


--
-- TOC entry 5355 (class 2606 OID 991805)
-- Name: bookings bookings_booking_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key UNIQUE (booking_number);


--
-- TOC entry 5357 (class 2606 OID 991821)
-- Name: bookings bookings_booking_number_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key1 UNIQUE (booking_number);


--
-- TOC entry 5359 (class 2606 OID 991909)
-- Name: bookings bookings_booking_number_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key10 UNIQUE (booking_number);


--
-- TOC entry 5361 (class 2606 OID 991677)
-- Name: bookings bookings_booking_number_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key100 UNIQUE (booking_number);


--
-- TOC entry 5363 (class 2606 OID 991667)
-- Name: bookings bookings_booking_number_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key101 UNIQUE (booking_number);


--
-- TOC entry 5365 (class 2606 OID 991815)
-- Name: bookings bookings_booking_number_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key102 UNIQUE (booking_number);


--
-- TOC entry 5367 (class 2606 OID 991997)
-- Name: bookings bookings_booking_number_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key103 UNIQUE (booking_number);


--
-- TOC entry 5369 (class 2606 OID 991679)
-- Name: bookings bookings_booking_number_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key104 UNIQUE (booking_number);


--
-- TOC entry 5371 (class 2606 OID 991911)
-- Name: bookings bookings_booking_number_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key105 UNIQUE (booking_number);


--
-- TOC entry 5373 (class 2606 OID 991681)
-- Name: bookings bookings_booking_number_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key106 UNIQUE (booking_number);


--
-- TOC entry 5375 (class 2606 OID 991871)
-- Name: bookings bookings_booking_number_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key107 UNIQUE (booking_number);


--
-- TOC entry 5377 (class 2606 OID 991683)
-- Name: bookings bookings_booking_number_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key108 UNIQUE (booking_number);


--
-- TOC entry 5379 (class 2606 OID 991869)
-- Name: bookings bookings_booking_number_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key109 UNIQUE (booking_number);


--
-- TOC entry 5381 (class 2606 OID 992095)
-- Name: bookings bookings_booking_number_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key11 UNIQUE (booking_number);


--
-- TOC entry 5383 (class 2606 OID 991673)
-- Name: bookings bookings_booking_number_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key110 UNIQUE (booking_number);


--
-- TOC entry 5385 (class 2606 OID 991867)
-- Name: bookings bookings_booking_number_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key111 UNIQUE (booking_number);


--
-- TOC entry 5387 (class 2606 OID 991687)
-- Name: bookings bookings_booking_number_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key112 UNIQUE (booking_number);


--
-- TOC entry 5389 (class 2606 OID 991865)
-- Name: bookings bookings_booking_number_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key113 UNIQUE (booking_number);


--
-- TOC entry 5391 (class 2606 OID 992175)
-- Name: bookings bookings_booking_number_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key114 UNIQUE (booking_number);


--
-- TOC entry 5393 (class 2606 OID 991863)
-- Name: bookings bookings_booking_number_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key115 UNIQUE (booking_number);


--
-- TOC entry 5395 (class 2606 OID 991689)
-- Name: bookings bookings_booking_number_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key116 UNIQUE (booking_number);


--
-- TOC entry 5397 (class 2606 OID 991861)
-- Name: bookings bookings_booking_number_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key117 UNIQUE (booking_number);


--
-- TOC entry 5399 (class 2606 OID 991691)
-- Name: bookings bookings_booking_number_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key118 UNIQUE (booking_number);


--
-- TOC entry 5401 (class 2606 OID 991859)
-- Name: bookings bookings_booking_number_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key119 UNIQUE (booking_number);


--
-- TOC entry 5403 (class 2606 OID 992141)
-- Name: bookings bookings_booking_number_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key12 UNIQUE (booking_number);


--
-- TOC entry 5405 (class 2606 OID 991693)
-- Name: bookings bookings_booking_number_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key120 UNIQUE (booking_number);


--
-- TOC entry 5407 (class 2606 OID 991857)
-- Name: bookings bookings_booking_number_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key121 UNIQUE (booking_number);


--
-- TOC entry 5409 (class 2606 OID 991695)
-- Name: bookings bookings_booking_number_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key122 UNIQUE (booking_number);


--
-- TOC entry 5411 (class 2606 OID 991855)
-- Name: bookings bookings_booking_number_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key123 UNIQUE (booking_number);


--
-- TOC entry 5413 (class 2606 OID 991697)
-- Name: bookings bookings_booking_number_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key124 UNIQUE (booking_number);


--
-- TOC entry 5415 (class 2606 OID 991853)
-- Name: bookings bookings_booking_number_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key125 UNIQUE (booking_number);


--
-- TOC entry 5417 (class 2606 OID 991699)
-- Name: bookings bookings_booking_number_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key126 UNIQUE (booking_number);


--
-- TOC entry 5419 (class 2606 OID 991851)
-- Name: bookings bookings_booking_number_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key127 UNIQUE (booking_number);


--
-- TOC entry 5421 (class 2606 OID 991701)
-- Name: bookings bookings_booking_number_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key128 UNIQUE (booking_number);


--
-- TOC entry 5423 (class 2606 OID 991849)
-- Name: bookings bookings_booking_number_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key129 UNIQUE (booking_number);


--
-- TOC entry 5425 (class 2606 OID 992143)
-- Name: bookings bookings_booking_number_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key13 UNIQUE (booking_number);


--
-- TOC entry 5427 (class 2606 OID 991745)
-- Name: bookings bookings_booking_number_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key130 UNIQUE (booking_number);


--
-- TOC entry 5429 (class 2606 OID 991847)
-- Name: bookings bookings_booking_number_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key131 UNIQUE (booking_number);


--
-- TOC entry 5431 (class 2606 OID 991747)
-- Name: bookings bookings_booking_number_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key132 UNIQUE (booking_number);


--
-- TOC entry 5433 (class 2606 OID 991845)
-- Name: bookings bookings_booking_number_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key133 UNIQUE (booking_number);


--
-- TOC entry 5435 (class 2606 OID 991749)
-- Name: bookings bookings_booking_number_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key134 UNIQUE (booking_number);


--
-- TOC entry 5437 (class 2606 OID 991843)
-- Name: bookings bookings_booking_number_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key135 UNIQUE (booking_number);


--
-- TOC entry 5439 (class 2606 OID 991705)
-- Name: bookings bookings_booking_number_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key136 UNIQUE (booking_number);


--
-- TOC entry 5441 (class 2606 OID 991707)
-- Name: bookings bookings_booking_number_key137; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key137 UNIQUE (booking_number);


--
-- TOC entry 5443 (class 2606 OID 991841)
-- Name: bookings bookings_booking_number_key138; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key138 UNIQUE (booking_number);


--
-- TOC entry 5445 (class 2606 OID 991839)
-- Name: bookings bookings_booking_number_key139; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key139 UNIQUE (booking_number);


--
-- TOC entry 5447 (class 2606 OID 991881)
-- Name: bookings bookings_booking_number_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key14 UNIQUE (booking_number);


--
-- TOC entry 5449 (class 2606 OID 992093)
-- Name: bookings bookings_booking_number_key140; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key140 UNIQUE (booking_number);


--
-- TOC entry 5451 (class 2606 OID 991837)
-- Name: bookings bookings_booking_number_key141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key141 UNIQUE (booking_number);


--
-- TOC entry 5453 (class 2606 OID 991709)
-- Name: bookings bookings_booking_number_key142; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key142 UNIQUE (booking_number);


--
-- TOC entry 5455 (class 2606 OID 991711)
-- Name: bookings bookings_booking_number_key143; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key143 UNIQUE (booking_number);


--
-- TOC entry 5457 (class 2606 OID 991835)
-- Name: bookings bookings_booking_number_key144; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key144 UNIQUE (booking_number);


--
-- TOC entry 5459 (class 2606 OID 991713)
-- Name: bookings bookings_booking_number_key145; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key145 UNIQUE (booking_number);


--
-- TOC entry 5461 (class 2606 OID 991833)
-- Name: bookings bookings_booking_number_key146; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key146 UNIQUE (booking_number);


--
-- TOC entry 5463 (class 2606 OID 991715)
-- Name: bookings bookings_booking_number_key147; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key147 UNIQUE (booking_number);


--
-- TOC entry 5465 (class 2606 OID 992089)
-- Name: bookings bookings_booking_number_key148; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key148 UNIQUE (booking_number);


--
-- TOC entry 5467 (class 2606 OID 992157)
-- Name: bookings bookings_booking_number_key149; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key149 UNIQUE (booking_number);


--
-- TOC entry 5469 (class 2606 OID 992145)
-- Name: bookings bookings_booking_number_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key15 UNIQUE (booking_number);


--
-- TOC entry 5471 (class 2606 OID 992087)
-- Name: bookings bookings_booking_number_key150; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key150 UNIQUE (booking_number);


--
-- TOC entry 5473 (class 2606 OID 992167)
-- Name: bookings bookings_booking_number_key151; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key151 UNIQUE (booking_number);


--
-- TOC entry 5475 (class 2606 OID 992085)
-- Name: bookings bookings_booking_number_key152; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key152 UNIQUE (booking_number);


--
-- TOC entry 5477 (class 2606 OID 992171)
-- Name: bookings bookings_booking_number_key153; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key153 UNIQUE (booking_number);


--
-- TOC entry 5479 (class 2606 OID 991717)
-- Name: bookings bookings_booking_number_key154; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key154 UNIQUE (booking_number);


--
-- TOC entry 5481 (class 2606 OID 992083)
-- Name: bookings bookings_booking_number_key155; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key155 UNIQUE (booking_number);


--
-- TOC entry 5483 (class 2606 OID 991719)
-- Name: bookings bookings_booking_number_key156; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key156 UNIQUE (booking_number);


--
-- TOC entry 5485 (class 2606 OID 991721)
-- Name: bookings bookings_booking_number_key157; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key157 UNIQUE (booking_number);


--
-- TOC entry 5487 (class 2606 OID 992007)
-- Name: bookings bookings_booking_number_key158; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key158 UNIQUE (booking_number);


--
-- TOC entry 5489 (class 2606 OID 992159)
-- Name: bookings bookings_booking_number_key159; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key159 UNIQUE (booking_number);


--
-- TOC entry 5491 (class 2606 OID 992147)
-- Name: bookings bookings_booking_number_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key16 UNIQUE (booking_number);


--
-- TOC entry 5493 (class 2606 OID 992005)
-- Name: bookings bookings_booking_number_key160; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key160 UNIQUE (booking_number);


--
-- TOC entry 5495 (class 2606 OID 992161)
-- Name: bookings bookings_booking_number_key161; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key161 UNIQUE (booking_number);


--
-- TOC entry 5497 (class 2606 OID 992003)
-- Name: bookings bookings_booking_number_key162; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key162 UNIQUE (booking_number);


--
-- TOC entry 5499 (class 2606 OID 992163)
-- Name: bookings bookings_booking_number_key163; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key163 UNIQUE (booking_number);


--
-- TOC entry 5501 (class 2606 OID 992001)
-- Name: bookings bookings_booking_number_key164; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key164 UNIQUE (booking_number);


--
-- TOC entry 5503 (class 2606 OID 991723)
-- Name: bookings bookings_booking_number_key165; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key165 UNIQUE (booking_number);


--
-- TOC entry 5505 (class 2606 OID 991725)
-- Name: bookings bookings_booking_number_key166; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key166 UNIQUE (booking_number);


--
-- TOC entry 5507 (class 2606 OID 991727)
-- Name: bookings bookings_booking_number_key167; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key167 UNIQUE (booking_number);


--
-- TOC entry 5509 (class 2606 OID 991999)
-- Name: bookings bookings_booking_number_key168; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key168 UNIQUE (booking_number);


--
-- TOC entry 5511 (class 2606 OID 991729)
-- Name: bookings bookings_booking_number_key169; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key169 UNIQUE (booking_number);


--
-- TOC entry 5513 (class 2606 OID 991879)
-- Name: bookings bookings_booking_number_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key17 UNIQUE (booking_number);


--
-- TOC entry 5515 (class 2606 OID 991733)
-- Name: bookings bookings_booking_number_key170; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key170 UNIQUE (booking_number);


--
-- TOC entry 5517 (class 2606 OID 991731)
-- Name: bookings bookings_booking_number_key171; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key171 UNIQUE (booking_number);


--
-- TOC entry 5519 (class 2606 OID 991883)
-- Name: bookings bookings_booking_number_key172; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key172 UNIQUE (booking_number);


--
-- TOC entry 5521 (class 2606 OID 991907)
-- Name: bookings bookings_booking_number_key173; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key173 UNIQUE (booking_number);


--
-- TOC entry 5523 (class 2606 OID 991885)
-- Name: bookings bookings_booking_number_key174; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key174 UNIQUE (booking_number);


--
-- TOC entry 5525 (class 2606 OID 991887)
-- Name: bookings bookings_booking_number_key175; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key175 UNIQUE (booking_number);


--
-- TOC entry 5527 (class 2606 OID 991899)
-- Name: bookings bookings_booking_number_key176; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key176 UNIQUE (booking_number);


--
-- TOC entry 5529 (class 2606 OID 991889)
-- Name: bookings bookings_booking_number_key177; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key177 UNIQUE (booking_number);


--
-- TOC entry 5531 (class 2606 OID 991897)
-- Name: bookings bookings_booking_number_key178; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key178 UNIQUE (booking_number);


--
-- TOC entry 5533 (class 2606 OID 991891)
-- Name: bookings bookings_booking_number_key179; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key179 UNIQUE (booking_number);


--
-- TOC entry 5535 (class 2606 OID 992149)
-- Name: bookings bookings_booking_number_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key18 UNIQUE (booking_number);


--
-- TOC entry 5537 (class 2606 OID 991895)
-- Name: bookings bookings_booking_number_key180; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key180 UNIQUE (booking_number);


--
-- TOC entry 5539 (class 2606 OID 991973)
-- Name: bookings bookings_booking_number_key181; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key181 UNIQUE (booking_number);


--
-- TOC entry 5541 (class 2606 OID 991893)
-- Name: bookings bookings_booking_number_key182; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key182 UNIQUE (booking_number);


--
-- TOC entry 5543 (class 2606 OID 991975)
-- Name: bookings bookings_booking_number_key183; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key183 UNIQUE (booking_number);


--
-- TOC entry 5545 (class 2606 OID 991949)
-- Name: bookings bookings_booking_number_key184; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key184 UNIQUE (booking_number);


--
-- TOC entry 5547 (class 2606 OID 992075)
-- Name: bookings bookings_booking_number_key185; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key185 UNIQUE (booking_number);


--
-- TOC entry 5549 (class 2606 OID 991947)
-- Name: bookings bookings_booking_number_key186; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key186 UNIQUE (booking_number);


--
-- TOC entry 5551 (class 2606 OID 991831)
-- Name: bookings bookings_booking_number_key187; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key187 UNIQUE (booking_number);


--
-- TOC entry 5553 (class 2606 OID 991945)
-- Name: bookings bookings_booking_number_key188; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key188 UNIQUE (booking_number);


--
-- TOC entry 5555 (class 2606 OID 991819)
-- Name: bookings bookings_booking_number_key189; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key189 UNIQUE (booking_number);


--
-- TOC entry 5557 (class 2606 OID 991765)
-- Name: bookings bookings_booking_number_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key19 UNIQUE (booking_number);


--
-- TOC entry 5559 (class 2606 OID 991943)
-- Name: bookings bookings_booking_number_key190; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key190 UNIQUE (booking_number);


--
-- TOC entry 5561 (class 2606 OID 991901)
-- Name: bookings bookings_booking_number_key191; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key191 UNIQUE (booking_number);


--
-- TOC entry 5563 (class 2606 OID 991941)
-- Name: bookings bookings_booking_number_key192; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key192 UNIQUE (booking_number);


--
-- TOC entry 5565 (class 2606 OID 991675)
-- Name: bookings bookings_booking_number_key193; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key193 UNIQUE (booking_number);


--
-- TOC entry 5567 (class 2606 OID 991939)
-- Name: bookings bookings_booking_number_key194; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key194 UNIQUE (booking_number);


--
-- TOC entry 5569 (class 2606 OID 991903)
-- Name: bookings bookings_booking_number_key195; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key195 UNIQUE (booking_number);


--
-- TOC entry 5571 (class 2606 OID 991937)
-- Name: bookings bookings_booking_number_key196; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key196 UNIQUE (booking_number);


--
-- TOC entry 5573 (class 2606 OID 991981)
-- Name: bookings bookings_booking_number_key197; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key197 UNIQUE (booking_number);


--
-- TOC entry 5575 (class 2606 OID 991935)
-- Name: bookings bookings_booking_number_key198; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key198 UNIQUE (booking_number);


--
-- TOC entry 5577 (class 2606 OID 991979)
-- Name: bookings bookings_booking_number_key199; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key199 UNIQUE (booking_number);


--
-- TOC entry 5579 (class 2606 OID 991823)
-- Name: bookings bookings_booking_number_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key2 UNIQUE (booking_number);


--
-- TOC entry 5581 (class 2606 OID 991763)
-- Name: bookings bookings_booking_number_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key20 UNIQUE (booking_number);


--
-- TOC entry 5583 (class 2606 OID 992077)
-- Name: bookings bookings_booking_number_key200; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key200 UNIQUE (booking_number);


--
-- TOC entry 5585 (class 2606 OID 992079)
-- Name: bookings bookings_booking_number_key201; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key201 UNIQUE (booking_number);


--
-- TOC entry 5587 (class 2606 OID 991933)
-- Name: bookings bookings_booking_number_key202; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key202 UNIQUE (booking_number);


--
-- TOC entry 5589 (class 2606 OID 992101)
-- Name: bookings bookings_booking_number_key203; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key203 UNIQUE (booking_number);


--
-- TOC entry 5591 (class 2606 OID 991931)
-- Name: bookings bookings_booking_number_key204; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key204 UNIQUE (booking_number);


--
-- TOC entry 5593 (class 2606 OID 992103)
-- Name: bookings bookings_booking_number_key205; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key205 UNIQUE (booking_number);


--
-- TOC entry 5595 (class 2606 OID 991929)
-- Name: bookings bookings_booking_number_key206; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key206 UNIQUE (booking_number);


--
-- TOC entry 5597 (class 2606 OID 992105)
-- Name: bookings bookings_booking_number_key207; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key207 UNIQUE (booking_number);


--
-- TOC entry 5599 (class 2606 OID 992129)
-- Name: bookings bookings_booking_number_key208; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key208 UNIQUE (booking_number);


--
-- TOC entry 5601 (class 2606 OID 992107)
-- Name: bookings bookings_booking_number_key209; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key209 UNIQUE (booking_number);


--
-- TOC entry 5603 (class 2606 OID 992179)
-- Name: bookings bookings_booking_number_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key21 UNIQUE (booking_number);


--
-- TOC entry 5605 (class 2606 OID 992109)
-- Name: bookings bookings_booking_number_key210; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key210 UNIQUE (booking_number);


--
-- TOC entry 5607 (class 2606 OID 992127)
-- Name: bookings bookings_booking_number_key211; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key211 UNIQUE (booking_number);


--
-- TOC entry 5609 (class 2606 OID 992111)
-- Name: bookings bookings_booking_number_key212; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key212 UNIQUE (booking_number);


--
-- TOC entry 5611 (class 2606 OID 992125)
-- Name: bookings bookings_booking_number_key213; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key213 UNIQUE (booking_number);


--
-- TOC entry 5613 (class 2606 OID 992113)
-- Name: bookings bookings_booking_number_key214; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key214 UNIQUE (booking_number);


--
-- TOC entry 5615 (class 2606 OID 992123)
-- Name: bookings bookings_booking_number_key215; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key215 UNIQUE (booking_number);


--
-- TOC entry 5617 (class 2606 OID 992115)
-- Name: bookings bookings_booking_number_key216; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key216 UNIQUE (booking_number);


--
-- TOC entry 5619 (class 2606 OID 992117)
-- Name: bookings bookings_booking_number_key217; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key217 UNIQUE (booking_number);


--
-- TOC entry 5621 (class 2606 OID 992121)
-- Name: bookings bookings_booking_number_key218; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key218 UNIQUE (booking_number);


--
-- TOC entry 5623 (class 2606 OID 992119)
-- Name: bookings bookings_booking_number_key219; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key219 UNIQUE (booking_number);


--
-- TOC entry 5625 (class 2606 OID 991761)
-- Name: bookings bookings_booking_number_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key22 UNIQUE (booking_number);


--
-- TOC entry 5627 (class 2606 OID 992081)
-- Name: bookings bookings_booking_number_key220; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key220 UNIQUE (booking_number);


--
-- TOC entry 5629 (class 2606 OID 992009)
-- Name: bookings bookings_booking_number_key221; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key221 UNIQUE (booking_number);


--
-- TOC entry 5631 (class 2606 OID 992011)
-- Name: bookings bookings_booking_number_key222; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key222 UNIQUE (booking_number);


--
-- TOC entry 5633 (class 2606 OID 992013)
-- Name: bookings bookings_booking_number_key223; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key223 UNIQUE (booking_number);


--
-- TOC entry 5635 (class 2606 OID 992059)
-- Name: bookings bookings_booking_number_key224; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key224 UNIQUE (booking_number);


--
-- TOC entry 5637 (class 2606 OID 992131)
-- Name: bookings bookings_booking_number_key225; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key225 UNIQUE (booking_number);


--
-- TOC entry 5639 (class 2606 OID 992057)
-- Name: bookings bookings_booking_number_key226; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key226 UNIQUE (booking_number);


--
-- TOC entry 5641 (class 2606 OID 992133)
-- Name: bookings bookings_booking_number_key227; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key227 UNIQUE (booking_number);


--
-- TOC entry 5643 (class 2606 OID 992043)
-- Name: bookings bookings_booking_number_key228; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key228 UNIQUE (booking_number);


--
-- TOC entry 5645 (class 2606 OID 991737)
-- Name: bookings bookings_booking_number_key229; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key229 UNIQUE (booking_number);


--
-- TOC entry 5647 (class 2606 OID 991811)
-- Name: bookings bookings_booking_number_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key23 UNIQUE (booking_number);


--
-- TOC entry 5649 (class 2606 OID 991739)
-- Name: bookings bookings_booking_number_key230; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key230 UNIQUE (booking_number);


--
-- TOC entry 5651 (class 2606 OID 991741)
-- Name: bookings bookings_booking_number_key231; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key231 UNIQUE (booking_number);


--
-- TOC entry 5653 (class 2606 OID 992041)
-- Name: bookings bookings_booking_number_key232; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key232 UNIQUE (booking_number);


--
-- TOC entry 5655 (class 2606 OID 992039)
-- Name: bookings bookings_booking_number_key233; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key233 UNIQUE (booking_number);


--
-- TOC entry 5657 (class 2606 OID 991905)
-- Name: bookings bookings_booking_number_key234; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key234 UNIQUE (booking_number);


--
-- TOC entry 5659 (class 2606 OID 992037)
-- Name: bookings bookings_booking_number_key235; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key235 UNIQUE (booking_number);


--
-- TOC entry 5661 (class 2606 OID 991743)
-- Name: bookings bookings_booking_number_key236; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key236 UNIQUE (booking_number);


--
-- TOC entry 5663 (class 2606 OID 992035)
-- Name: bookings bookings_booking_number_key237; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key237 UNIQUE (booking_number);


--
-- TOC entry 5665 (class 2606 OID 991775)
-- Name: bookings bookings_booking_number_key238; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key238 UNIQUE (booking_number);


--
-- TOC entry 5667 (class 2606 OID 992015)
-- Name: bookings bookings_booking_number_key239; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key239 UNIQUE (booking_number);


--
-- TOC entry 5669 (class 2606 OID 991759)
-- Name: bookings bookings_booking_number_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key24 UNIQUE (booking_number);


--
-- TOC entry 5671 (class 2606 OID 991777)
-- Name: bookings bookings_booking_number_key240; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key240 UNIQUE (booking_number);


--
-- TOC entry 5673 (class 2606 OID 991927)
-- Name: bookings bookings_booking_number_key241; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key241 UNIQUE (booking_number);


--
-- TOC entry 5675 (class 2606 OID 991779)
-- Name: bookings bookings_booking_number_key242; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key242 UNIQUE (booking_number);


--
-- TOC entry 5677 (class 2606 OID 991783)
-- Name: bookings bookings_booking_number_key243; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key243 UNIQUE (booking_number);


--
-- TOC entry 5679 (class 2606 OID 991781)
-- Name: bookings bookings_booking_number_key244; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key244 UNIQUE (booking_number);


--
-- TOC entry 5681 (class 2606 OID 991685)
-- Name: bookings bookings_booking_number_key245; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key245 UNIQUE (booking_number);


--
-- TOC entry 5683 (class 2606 OID 991983)
-- Name: bookings bookings_booking_number_key246; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key246 UNIQUE (booking_number);


--
-- TOC entry 5685 (class 2606 OID 992187)
-- Name: bookings bookings_booking_number_key247; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key247 UNIQUE (booking_number);


--
-- TOC entry 5687 (class 2606 OID 991801)
-- Name: bookings bookings_booking_number_key248; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key248 UNIQUE (booking_number);


--
-- TOC entry 5689 (class 2606 OID 992189)
-- Name: bookings bookings_booking_number_key249; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key249 UNIQUE (booking_number);


--
-- TOC entry 5691 (class 2606 OID 991757)
-- Name: bookings bookings_booking_number_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key25 UNIQUE (booking_number);


--
-- TOC entry 5693 (class 2606 OID 991799)
-- Name: bookings bookings_booking_number_key250; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key250 UNIQUE (booking_number);


--
-- TOC entry 5695 (class 2606 OID 991797)
-- Name: bookings bookings_booking_number_key251; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key251 UNIQUE (booking_number);


--
-- TOC entry 5697 (class 2606 OID 991955)
-- Name: bookings bookings_booking_number_key252; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key252 UNIQUE (booking_number);


--
-- TOC entry 5699 (class 2606 OID 991787)
-- Name: bookings bookings_booking_number_key253; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key253 UNIQUE (booking_number);


--
-- TOC entry 5701 (class 2606 OID 991795)
-- Name: bookings bookings_booking_number_key254; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key254 UNIQUE (booking_number);


--
-- TOC entry 5703 (class 2606 OID 991789)
-- Name: bookings bookings_booking_number_key255; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key255 UNIQUE (booking_number);


--
-- TOC entry 5705 (class 2606 OID 991793)
-- Name: bookings bookings_booking_number_key256; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key256 UNIQUE (booking_number);


--
-- TOC entry 5707 (class 2606 OID 991791)
-- Name: bookings bookings_booking_number_key257; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key257 UNIQUE (booking_number);


--
-- TOC entry 5709 (class 2606 OID 992191)
-- Name: bookings bookings_booking_number_key258; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key258 UNIQUE (booking_number);


--
-- TOC entry 5711 (class 2606 OID 991785)
-- Name: bookings bookings_booking_number_key259; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key259 UNIQUE (booking_number);


--
-- TOC entry 5713 (class 2606 OID 991813)
-- Name: bookings bookings_booking_number_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key26 UNIQUE (booking_number);


--
-- TOC entry 5715 (class 2606 OID 992193)
-- Name: bookings bookings_booking_number_key260; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key260 UNIQUE (booking_number);


--
-- TOC entry 5717 (class 2606 OID 991773)
-- Name: bookings bookings_booking_number_key261; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key261 UNIQUE (booking_number);


--
-- TOC entry 5719 (class 2606 OID 992195)
-- Name: bookings bookings_booking_number_key262; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key262 UNIQUE (booking_number);


--
-- TOC entry 5721 (class 2606 OID 991771)
-- Name: bookings bookings_booking_number_key263; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key263 UNIQUE (booking_number);


--
-- TOC entry 5723 (class 2606 OID 992165)
-- Name: bookings bookings_booking_number_key264; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key264 UNIQUE (booking_number);


--
-- TOC entry 5725 (class 2606 OID 991769)
-- Name: bookings bookings_booking_number_key265; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key265 UNIQUE (booking_number);


--
-- TOC entry 5727 (class 2606 OID 992197)
-- Name: bookings bookings_booking_number_key266; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key266 UNIQUE (booking_number);


--
-- TOC entry 5729 (class 2606 OID 991767)
-- Name: bookings bookings_booking_number_key267; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key267 UNIQUE (booking_number);


--
-- TOC entry 5731 (class 2606 OID 992199)
-- Name: bookings bookings_booking_number_key268; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key268 UNIQUE (booking_number);


--
-- TOC entry 5733 (class 2606 OID 992201)
-- Name: bookings bookings_booking_number_key269; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key269 UNIQUE (booking_number);


--
-- TOC entry 5735 (class 2606 OID 991755)
-- Name: bookings bookings_booking_number_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key27 UNIQUE (booking_number);


--
-- TOC entry 5737 (class 2606 OID 992203)
-- Name: bookings bookings_booking_number_key270; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key270 UNIQUE (booking_number);


--
-- TOC entry 5739 (class 2606 OID 991659)
-- Name: bookings bookings_booking_number_key271; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key271 UNIQUE (booking_number);


--
-- TOC entry 5741 (class 2606 OID 992205)
-- Name: bookings bookings_booking_number_key272; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key272 UNIQUE (booking_number);


--
-- TOC entry 5743 (class 2606 OID 992207)
-- Name: bookings bookings_booking_number_key273; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key273 UNIQUE (booking_number);


--
-- TOC entry 5745 (class 2606 OID 991657)
-- Name: bookings bookings_booking_number_key274; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key274 UNIQUE (booking_number);


--
-- TOC entry 5747 (class 2606 OID 992209)
-- Name: bookings bookings_booking_number_key275; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key275 UNIQUE (booking_number);


--
-- TOC entry 5749 (class 2606 OID 991655)
-- Name: bookings bookings_booking_number_key276; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key276 UNIQUE (booking_number);


--
-- TOC entry 5751 (class 2606 OID 992169)
-- Name: bookings bookings_booking_number_key277; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key277 UNIQUE (booking_number);


--
-- TOC entry 5753 (class 2606 OID 991653)
-- Name: bookings bookings_booking_number_key278; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key278 UNIQUE (booking_number);


--
-- TOC entry 5755 (class 2606 OID 992211)
-- Name: bookings bookings_booking_number_key279; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key279 UNIQUE (booking_number);


--
-- TOC entry 5757 (class 2606 OID 991753)
-- Name: bookings bookings_booking_number_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key28 UNIQUE (booking_number);


--
-- TOC entry 5759 (class 2606 OID 992213)
-- Name: bookings bookings_booking_number_key280; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key280 UNIQUE (booking_number);


--
-- TOC entry 5761 (class 2606 OID 991817)
-- Name: bookings bookings_booking_number_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key29 UNIQUE (booking_number);


--
-- TOC entry 5763 (class 2606 OID 991825)
-- Name: bookings bookings_booking_number_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key3 UNIQUE (booking_number);


--
-- TOC entry 5765 (class 2606 OID 991751)
-- Name: bookings bookings_booking_number_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key30 UNIQUE (booking_number);


--
-- TOC entry 5767 (class 2606 OID 992051)
-- Name: bookings bookings_booking_number_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key31 UNIQUE (booking_number);


--
-- TOC entry 5769 (class 2606 OID 992055)
-- Name: bookings bookings_booking_number_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key32 UNIQUE (booking_number);


--
-- TOC entry 5771 (class 2606 OID 992017)
-- Name: bookings bookings_booking_number_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key33 UNIQUE (booking_number);


--
-- TOC entry 5773 (class 2606 OID 991809)
-- Name: bookings bookings_booking_number_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key34 UNIQUE (booking_number);


--
-- TOC entry 5775 (class 2606 OID 992019)
-- Name: bookings bookings_booking_number_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key35 UNIQUE (booking_number);


--
-- TOC entry 5777 (class 2606 OID 991807)
-- Name: bookings bookings_booking_number_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key36 UNIQUE (booking_number);


--
-- TOC entry 5779 (class 2606 OID 992069)
-- Name: bookings bookings_booking_number_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key37 UNIQUE (booking_number);


--
-- TOC entry 5781 (class 2606 OID 992139)
-- Name: bookings bookings_booking_number_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key38 UNIQUE (booking_number);


--
-- TOC entry 5783 (class 2606 OID 992071)
-- Name: bookings bookings_booking_number_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key39 UNIQUE (booking_number);


--
-- TOC entry 5785 (class 2606 OID 991803)
-- Name: bookings bookings_booking_number_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key4 UNIQUE (booking_number);


--
-- TOC entry 5787 (class 2606 OID 992137)
-- Name: bookings bookings_booking_number_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key40 UNIQUE (booking_number);


--
-- TOC entry 5789 (class 2606 OID 992073)
-- Name: bookings bookings_booking_number_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key41 UNIQUE (booking_number);


--
-- TOC entry 5791 (class 2606 OID 992021)
-- Name: bookings bookings_booking_number_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key42 UNIQUE (booking_number);


--
-- TOC entry 5793 (class 2606 OID 992023)
-- Name: bookings bookings_booking_number_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key43 UNIQUE (booking_number);


--
-- TOC entry 5795 (class 2606 OID 992049)
-- Name: bookings bookings_booking_number_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key44 UNIQUE (booking_number);


--
-- TOC entry 5797 (class 2606 OID 992025)
-- Name: bookings bookings_booking_number_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key45 UNIQUE (booking_number);


--
-- TOC entry 5799 (class 2606 OID 992027)
-- Name: bookings bookings_booking_number_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key46 UNIQUE (booking_number);


--
-- TOC entry 5801 (class 2606 OID 992047)
-- Name: bookings bookings_booking_number_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key47 UNIQUE (booking_number);


--
-- TOC entry 5803 (class 2606 OID 992029)
-- Name: bookings bookings_booking_number_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key48 UNIQUE (booking_number);


--
-- TOC entry 5805 (class 2606 OID 991913)
-- Name: bookings bookings_booking_number_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key49 UNIQUE (booking_number);


--
-- TOC entry 5807 (class 2606 OID 991993)
-- Name: bookings bookings_booking_number_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key5 UNIQUE (booking_number);


--
-- TOC entry 5809 (class 2606 OID 991735)
-- Name: bookings bookings_booking_number_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key50 UNIQUE (booking_number);


--
-- TOC entry 5811 (class 2606 OID 991915)
-- Name: bookings bookings_booking_number_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key51 UNIQUE (booking_number);


--
-- TOC entry 5813 (class 2606 OID 991665)
-- Name: bookings bookings_booking_number_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key52 UNIQUE (booking_number);


--
-- TOC entry 5815 (class 2606 OID 992135)
-- Name: bookings bookings_booking_number_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key53 UNIQUE (booking_number);


--
-- TOC entry 5817 (class 2606 OID 991663)
-- Name: bookings bookings_booking_number_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key54 UNIQUE (booking_number);


--
-- TOC entry 5819 (class 2606 OID 991977)
-- Name: bookings bookings_booking_number_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key55 UNIQUE (booking_number);


--
-- TOC entry 5821 (class 2606 OID 991985)
-- Name: bookings bookings_booking_number_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key56 UNIQUE (booking_number);


--
-- TOC entry 5823 (class 2606 OID 991877)
-- Name: bookings bookings_booking_number_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key57 UNIQUE (booking_number);


--
-- TOC entry 5825 (class 2606 OID 991987)
-- Name: bookings bookings_booking_number_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key58 UNIQUE (booking_number);


--
-- TOC entry 5827 (class 2606 OID 991989)
-- Name: bookings bookings_booking_number_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key59 UNIQUE (booking_number);


--
-- TOC entry 5829 (class 2606 OID 991961)
-- Name: bookings bookings_booking_number_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key6 UNIQUE (booking_number);


--
-- TOC entry 5831 (class 2606 OID 991875)
-- Name: bookings bookings_booking_number_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key60 UNIQUE (booking_number);


--
-- TOC entry 5833 (class 2606 OID 991917)
-- Name: bookings bookings_booking_number_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key61 UNIQUE (booking_number);


--
-- TOC entry 5835 (class 2606 OID 991873)
-- Name: bookings bookings_booking_number_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key62 UNIQUE (booking_number);


--
-- TOC entry 5837 (class 2606 OID 992053)
-- Name: bookings bookings_booking_number_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key63 UNIQUE (booking_number);


--
-- TOC entry 5839 (class 2606 OID 992173)
-- Name: bookings bookings_booking_number_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key64 UNIQUE (booking_number);


--
-- TOC entry 5841 (class 2606 OID 992045)
-- Name: bookings bookings_booking_number_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key65 UNIQUE (booking_number);


--
-- TOC entry 5843 (class 2606 OID 992155)
-- Name: bookings bookings_booking_number_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key66 UNIQUE (booking_number);


--
-- TOC entry 5845 (class 2606 OID 991661)
-- Name: bookings bookings_booking_number_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key67 UNIQUE (booking_number);


--
-- TOC entry 5847 (class 2606 OID 992153)
-- Name: bookings bookings_booking_number_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key68 UNIQUE (booking_number);


--
-- TOC entry 5849 (class 2606 OID 991995)
-- Name: bookings bookings_booking_number_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key69 UNIQUE (booking_number);


--
-- TOC entry 5851 (class 2606 OID 991703)
-- Name: bookings bookings_booking_number_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key7 UNIQUE (booking_number);


--
-- TOC entry 5853 (class 2606 OID 992151)
-- Name: bookings bookings_booking_number_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key70 UNIQUE (booking_number);


--
-- TOC entry 5855 (class 2606 OID 991991)
-- Name: bookings bookings_booking_number_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key71 UNIQUE (booking_number);


--
-- TOC entry 5857 (class 2606 OID 992177)
-- Name: bookings bookings_booking_number_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key72 UNIQUE (booking_number);


--
-- TOC entry 5859 (class 2606 OID 991827)
-- Name: bookings bookings_booking_number_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key73 UNIQUE (booking_number);


--
-- TOC entry 5861 (class 2606 OID 991923)
-- Name: bookings bookings_booking_number_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key74 UNIQUE (booking_number);


--
-- TOC entry 5863 (class 2606 OID 991829)
-- Name: bookings bookings_booking_number_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key75 UNIQUE (booking_number);


--
-- TOC entry 5865 (class 2606 OID 991921)
-- Name: bookings bookings_booking_number_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key76 UNIQUE (booking_number);


--
-- TOC entry 5867 (class 2606 OID 991919)
-- Name: bookings bookings_booking_number_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key77 UNIQUE (booking_number);


--
-- TOC entry 5869 (class 2606 OID 992067)
-- Name: bookings bookings_booking_number_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key78 UNIQUE (booking_number);


--
-- TOC entry 5871 (class 2606 OID 992097)
-- Name: bookings bookings_booking_number_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key79 UNIQUE (booking_number);


--
-- TOC entry 5873 (class 2606 OID 991925)
-- Name: bookings bookings_booking_number_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key8 UNIQUE (booking_number);


--
-- TOC entry 5875 (class 2606 OID 992065)
-- Name: bookings bookings_booking_number_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key80 UNIQUE (booking_number);


--
-- TOC entry 5877 (class 2606 OID 992099)
-- Name: bookings bookings_booking_number_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key81 UNIQUE (booking_number);


--
-- TOC entry 5879 (class 2606 OID 992063)
-- Name: bookings bookings_booking_number_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key82 UNIQUE (booking_number);


--
-- TOC entry 5881 (class 2606 OID 992061)
-- Name: bookings bookings_booking_number_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key83 UNIQUE (booking_number);


--
-- TOC entry 5883 (class 2606 OID 991959)
-- Name: bookings bookings_booking_number_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key84 UNIQUE (booking_number);


--
-- TOC entry 5885 (class 2606 OID 992031)
-- Name: bookings bookings_booking_number_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key85 UNIQUE (booking_number);


--
-- TOC entry 5887 (class 2606 OID 991957)
-- Name: bookings bookings_booking_number_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key86 UNIQUE (booking_number);


--
-- TOC entry 5889 (class 2606 OID 992033)
-- Name: bookings bookings_booking_number_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key87 UNIQUE (booking_number);


--
-- TOC entry 5891 (class 2606 OID 991953)
-- Name: bookings bookings_booking_number_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key88 UNIQUE (booking_number);


--
-- TOC entry 5893 (class 2606 OID 991951)
-- Name: bookings bookings_booking_number_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key89 UNIQUE (booking_number);


--
-- TOC entry 5895 (class 2606 OID 992091)
-- Name: bookings bookings_booking_number_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key9 UNIQUE (booking_number);


--
-- TOC entry 5897 (class 2606 OID 992185)
-- Name: bookings bookings_booking_number_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key90 UNIQUE (booking_number);


--
-- TOC entry 5899 (class 2606 OID 991963)
-- Name: bookings bookings_booking_number_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key91 UNIQUE (booking_number);


--
-- TOC entry 5901 (class 2606 OID 991965)
-- Name: bookings bookings_booking_number_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key92 UNIQUE (booking_number);


--
-- TOC entry 5903 (class 2606 OID 992183)
-- Name: bookings bookings_booking_number_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key93 UNIQUE (booking_number);


--
-- TOC entry 5905 (class 2606 OID 991967)
-- Name: bookings bookings_booking_number_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key94 UNIQUE (booking_number);


--
-- TOC entry 5907 (class 2606 OID 992181)
-- Name: bookings bookings_booking_number_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key95 UNIQUE (booking_number);


--
-- TOC entry 5909 (class 2606 OID 991969)
-- Name: bookings bookings_booking_number_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key96 UNIQUE (booking_number);


--
-- TOC entry 5911 (class 2606 OID 991671)
-- Name: bookings bookings_booking_number_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key97 UNIQUE (booking_number);


--
-- TOC entry 5913 (class 2606 OID 991971)
-- Name: bookings bookings_booking_number_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key98 UNIQUE (booking_number);


--
-- TOC entry 5915 (class 2606 OID 991669)
-- Name: bookings bookings_booking_number_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key99 UNIQUE (booking_number);


--
-- TOC entry 5917 (class 2606 OID 714701)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- TOC entry 6294 (class 2606 OID 878594)
-- Name: c2b_payments c2b_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 6297 (class 2606 OID 992687)
-- Name: c2b_payments c2b_payments_trans_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key UNIQUE (trans_id);


--
-- TOC entry 6299 (class 2606 OID 992689)
-- Name: c2b_payments c2b_payments_trans_id_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key1 UNIQUE (trans_id);


--
-- TOC entry 6301 (class 2606 OID 992703)
-- Name: c2b_payments c2b_payments_trans_id_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key10 UNIQUE (trans_id);


--
-- TOC entry 6303 (class 2606 OID 992681)
-- Name: c2b_payments c2b_payments_trans_id_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key11 UNIQUE (trans_id);


--
-- TOC entry 6305 (class 2606 OID 992705)
-- Name: c2b_payments c2b_payments_trans_id_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key12 UNIQUE (trans_id);


--
-- TOC entry 6307 (class 2606 OID 992707)
-- Name: c2b_payments c2b_payments_trans_id_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key13 UNIQUE (trans_id);


--
-- TOC entry 6309 (class 2606 OID 992679)
-- Name: c2b_payments c2b_payments_trans_id_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key14 UNIQUE (trans_id);


--
-- TOC entry 6311 (class 2606 OID 992709)
-- Name: c2b_payments c2b_payments_trans_id_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key15 UNIQUE (trans_id);


--
-- TOC entry 6313 (class 2606 OID 992677)
-- Name: c2b_payments c2b_payments_trans_id_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key16 UNIQUE (trans_id);


--
-- TOC entry 6315 (class 2606 OID 992711)
-- Name: c2b_payments c2b_payments_trans_id_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key17 UNIQUE (trans_id);


--
-- TOC entry 6317 (class 2606 OID 992675)
-- Name: c2b_payments c2b_payments_trans_id_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key18 UNIQUE (trans_id);


--
-- TOC entry 6319 (class 2606 OID 992713)
-- Name: c2b_payments c2b_payments_trans_id_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key19 UNIQUE (trans_id);


--
-- TOC entry 6321 (class 2606 OID 992691)
-- Name: c2b_payments c2b_payments_trans_id_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key2 UNIQUE (trans_id);


--
-- TOC entry 6323 (class 2606 OID 992715)
-- Name: c2b_payments c2b_payments_trans_id_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key20 UNIQUE (trans_id);


--
-- TOC entry 6325 (class 2606 OID 992673)
-- Name: c2b_payments c2b_payments_trans_id_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key21 UNIQUE (trans_id);


--
-- TOC entry 6327 (class 2606 OID 992717)
-- Name: c2b_payments c2b_payments_trans_id_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key22 UNIQUE (trans_id);


--
-- TOC entry 6329 (class 2606 OID 992665)
-- Name: c2b_payments c2b_payments_trans_id_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key23 UNIQUE (trans_id);


--
-- TOC entry 6331 (class 2606 OID 992719)
-- Name: c2b_payments c2b_payments_trans_id_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key24 UNIQUE (trans_id);


--
-- TOC entry 6333 (class 2606 OID 992721)
-- Name: c2b_payments c2b_payments_trans_id_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key25 UNIQUE (trans_id);


--
-- TOC entry 6335 (class 2606 OID 992731)
-- Name: c2b_payments c2b_payments_trans_id_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key26 UNIQUE (trans_id);


--
-- TOC entry 6337 (class 2606 OID 992663)
-- Name: c2b_payments c2b_payments_trans_id_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key27 UNIQUE (trans_id);


--
-- TOC entry 6339 (class 2606 OID 992733)
-- Name: c2b_payments c2b_payments_trans_id_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key28 UNIQUE (trans_id);


--
-- TOC entry 6341 (class 2606 OID 992661)
-- Name: c2b_payments c2b_payments_trans_id_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key29 UNIQUE (trans_id);


--
-- TOC entry 6343 (class 2606 OID 992693)
-- Name: c2b_payments c2b_payments_trans_id_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key3 UNIQUE (trans_id);


--
-- TOC entry 6345 (class 2606 OID 992735)
-- Name: c2b_payments c2b_payments_trans_id_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key30 UNIQUE (trans_id);


--
-- TOC entry 6347 (class 2606 OID 992659)
-- Name: c2b_payments c2b_payments_trans_id_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key31 UNIQUE (trans_id);


--
-- TOC entry 6349 (class 2606 OID 992737)
-- Name: c2b_payments c2b_payments_trans_id_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key32 UNIQUE (trans_id);


--
-- TOC entry 6351 (class 2606 OID 992739)
-- Name: c2b_payments c2b_payments_trans_id_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key33 UNIQUE (trans_id);


--
-- TOC entry 6353 (class 2606 OID 992657)
-- Name: c2b_payments c2b_payments_trans_id_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key34 UNIQUE (trans_id);


--
-- TOC entry 6355 (class 2606 OID 992651)
-- Name: c2b_payments c2b_payments_trans_id_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key35 UNIQUE (trans_id);


--
-- TOC entry 6357 (class 2606 OID 992655)
-- Name: c2b_payments c2b_payments_trans_id_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key36 UNIQUE (trans_id);


--
-- TOC entry 6359 (class 2606 OID 992653)
-- Name: c2b_payments c2b_payments_trans_id_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key37 UNIQUE (trans_id);


--
-- TOC entry 6361 (class 2606 OID 992741)
-- Name: c2b_payments c2b_payments_trans_id_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key38 UNIQUE (trans_id);


--
-- TOC entry 6363 (class 2606 OID 992649)
-- Name: c2b_payments c2b_payments_trans_id_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key39 UNIQUE (trans_id);


--
-- TOC entry 6365 (class 2606 OID 992695)
-- Name: c2b_payments c2b_payments_trans_id_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key4 UNIQUE (trans_id);


--
-- TOC entry 6367 (class 2606 OID 992743)
-- Name: c2b_payments c2b_payments_trans_id_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key40 UNIQUE (trans_id);


--
-- TOC entry 6369 (class 2606 OID 992647)
-- Name: c2b_payments c2b_payments_trans_id_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key41 UNIQUE (trans_id);


--
-- TOC entry 6371 (class 2606 OID 992761)
-- Name: c2b_payments c2b_payments_trans_id_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key42 UNIQUE (trans_id);


--
-- TOC entry 6373 (class 2606 OID 992643)
-- Name: c2b_payments c2b_payments_trans_id_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key43 UNIQUE (trans_id);


--
-- TOC entry 6375 (class 2606 OID 992763)
-- Name: c2b_payments c2b_payments_trans_id_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key44 UNIQUE (trans_id);


--
-- TOC entry 6377 (class 2606 OID 992641)
-- Name: c2b_payments c2b_payments_trans_id_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key45 UNIQUE (trans_id);


--
-- TOC entry 6379 (class 2606 OID 992765)
-- Name: c2b_payments c2b_payments_trans_id_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key46 UNIQUE (trans_id);


--
-- TOC entry 6381 (class 2606 OID 992635)
-- Name: c2b_payments c2b_payments_trans_id_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key47 UNIQUE (trans_id);


--
-- TOC entry 6383 (class 2606 OID 992771)
-- Name: c2b_payments c2b_payments_trans_id_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key48 UNIQUE (trans_id);


--
-- TOC entry 6385 (class 2606 OID 992633)
-- Name: c2b_payments c2b_payments_trans_id_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key49 UNIQUE (trans_id);


--
-- TOC entry 6387 (class 2606 OID 992685)
-- Name: c2b_payments c2b_payments_trans_id_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key5 UNIQUE (trans_id);


--
-- TOC entry 6389 (class 2606 OID 992773)
-- Name: c2b_payments c2b_payments_trans_id_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key50 UNIQUE (trans_id);


--
-- TOC entry 6391 (class 2606 OID 992631)
-- Name: c2b_payments c2b_payments_trans_id_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key51 UNIQUE (trans_id);


--
-- TOC entry 6393 (class 2606 OID 992775)
-- Name: c2b_payments c2b_payments_trans_id_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key52 UNIQUE (trans_id);


--
-- TOC entry 6395 (class 2606 OID 992629)
-- Name: c2b_payments c2b_payments_trans_id_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key53 UNIQUE (trans_id);


--
-- TOC entry 6397 (class 2606 OID 992619)
-- Name: c2b_payments c2b_payments_trans_id_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key54 UNIQUE (trans_id);


--
-- TOC entry 6399 (class 2606 OID 992623)
-- Name: c2b_payments c2b_payments_trans_id_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key55 UNIQUE (trans_id);


--
-- TOC entry 6401 (class 2606 OID 992621)
-- Name: c2b_payments c2b_payments_trans_id_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key56 UNIQUE (trans_id);


--
-- TOC entry 6403 (class 2606 OID 992769)
-- Name: c2b_payments c2b_payments_trans_id_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key57 UNIQUE (trans_id);


--
-- TOC entry 6405 (class 2606 OID 992767)
-- Name: c2b_payments c2b_payments_trans_id_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key58 UNIQUE (trans_id);


--
-- TOC entry 6407 (class 2606 OID 992723)
-- Name: c2b_payments c2b_payments_trans_id_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key59 UNIQUE (trans_id);


--
-- TOC entry 6409 (class 2606 OID 992697)
-- Name: c2b_payments c2b_payments_trans_id_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key6 UNIQUE (trans_id);


--
-- TOC entry 6411 (class 2606 OID 992729)
-- Name: c2b_payments c2b_payments_trans_id_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key60 UNIQUE (trans_id);


--
-- TOC entry 6413 (class 2606 OID 992725)
-- Name: c2b_payments c2b_payments_trans_id_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key61 UNIQUE (trans_id);


--
-- TOC entry 6415 (class 2606 OID 992727)
-- Name: c2b_payments c2b_payments_trans_id_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key62 UNIQUE (trans_id);


--
-- TOC entry 6417 (class 2606 OID 992637)
-- Name: c2b_payments c2b_payments_trans_id_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key63 UNIQUE (trans_id);


--
-- TOC entry 6419 (class 2606 OID 992645)
-- Name: c2b_payments c2b_payments_trans_id_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key64 UNIQUE (trans_id);


--
-- TOC entry 6421 (class 2606 OID 992625)
-- Name: c2b_payments c2b_payments_trans_id_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key65 UNIQUE (trans_id);


--
-- TOC entry 6423 (class 2606 OID 992627)
-- Name: c2b_payments c2b_payments_trans_id_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key66 UNIQUE (trans_id);


--
-- TOC entry 6425 (class 2606 OID 992745)
-- Name: c2b_payments c2b_payments_trans_id_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key67 UNIQUE (trans_id);


--
-- TOC entry 6427 (class 2606 OID 992759)
-- Name: c2b_payments c2b_payments_trans_id_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key68 UNIQUE (trans_id);


--
-- TOC entry 6429 (class 2606 OID 992747)
-- Name: c2b_payments c2b_payments_trans_id_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key69 UNIQUE (trans_id);


--
-- TOC entry 6431 (class 2606 OID 992699)
-- Name: c2b_payments c2b_payments_trans_id_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key7 UNIQUE (trans_id);


--
-- TOC entry 6433 (class 2606 OID 992749)
-- Name: c2b_payments c2b_payments_trans_id_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key70 UNIQUE (trans_id);


--
-- TOC entry 6435 (class 2606 OID 992751)
-- Name: c2b_payments c2b_payments_trans_id_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key71 UNIQUE (trans_id);


--
-- TOC entry 6437 (class 2606 OID 992757)
-- Name: c2b_payments c2b_payments_trans_id_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key72 UNIQUE (trans_id);


--
-- TOC entry 6439 (class 2606 OID 992753)
-- Name: c2b_payments c2b_payments_trans_id_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key73 UNIQUE (trans_id);


--
-- TOC entry 6441 (class 2606 OID 992755)
-- Name: c2b_payments c2b_payments_trans_id_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key74 UNIQUE (trans_id);


--
-- TOC entry 6443 (class 2606 OID 992671)
-- Name: c2b_payments c2b_payments_trans_id_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key75 UNIQUE (trans_id);


--
-- TOC entry 6445 (class 2606 OID 992667)
-- Name: c2b_payments c2b_payments_trans_id_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key76 UNIQUE (trans_id);


--
-- TOC entry 6447 (class 2606 OID 992669)
-- Name: c2b_payments c2b_payments_trans_id_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key77 UNIQUE (trans_id);


--
-- TOC entry 6449 (class 2606 OID 992639)
-- Name: c2b_payments c2b_payments_trans_id_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key78 UNIQUE (trans_id);


--
-- TOC entry 6451 (class 2606 OID 992617)
-- Name: c2b_payments c2b_payments_trans_id_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key79 UNIQUE (trans_id);


--
-- TOC entry 6453 (class 2606 OID 992701)
-- Name: c2b_payments c2b_payments_trans_id_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key8 UNIQUE (trans_id);


--
-- TOC entry 6455 (class 2606 OID 992777)
-- Name: c2b_payments c2b_payments_trans_id_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key80 UNIQUE (trans_id);


--
-- TOC entry 6457 (class 2606 OID 992779)
-- Name: c2b_payments c2b_payments_trans_id_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key81 UNIQUE (trans_id);


--
-- TOC entry 6459 (class 2606 OID 992683)
-- Name: c2b_payments c2b_payments_trans_id_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_trans_id_key9 UNIQUE (trans_id);


--
-- TOC entry 6463 (class 2606 OID 878626)
-- Name: expected_payments expected_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expected_payments
    ADD CONSTRAINT expected_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 5353 (class 2606 OID 714669)
-- Name: package_images package_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_images
    ADD CONSTRAINT package_images_pkey PRIMARY KEY (id);


--
-- TOC entry 5929 (class 2606 OID 871459)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 5933 (class 2606 OID 992560)
-- Name: payments payments_stripe_payment_intent_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5935 (class 2606 OID 992558)
-- Name: payments payments_stripe_payment_intent_id_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key1 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5937 (class 2606 OID 992570)
-- Name: payments payments_stripe_payment_intent_id_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key10 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5939 (class 2606 OID 992572)
-- Name: payments payments_stripe_payment_intent_id_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key11 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5941 (class 2606 OID 992574)
-- Name: payments payments_stripe_payment_intent_id_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key12 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5943 (class 2606 OID 992548)
-- Name: payments payments_stripe_payment_intent_id_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key13 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5945 (class 2606 OID 992576)
-- Name: payments payments_stripe_payment_intent_id_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key14 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5947 (class 2606 OID 992546)
-- Name: payments payments_stripe_payment_intent_id_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key15 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5949 (class 2606 OID 992578)
-- Name: payments payments_stripe_payment_intent_id_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key16 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5951 (class 2606 OID 992544)
-- Name: payments payments_stripe_payment_intent_id_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key17 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5953 (class 2606 OID 992580)
-- Name: payments payments_stripe_payment_intent_id_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key18 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5955 (class 2606 OID 992542)
-- Name: payments payments_stripe_payment_intent_id_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key19 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5957 (class 2606 OID 992562)
-- Name: payments payments_stripe_payment_intent_id_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key2 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5959 (class 2606 OID 992582)
-- Name: payments payments_stripe_payment_intent_id_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key20 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5961 (class 2606 OID 992584)
-- Name: payments payments_stripe_payment_intent_id_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key21 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5963 (class 2606 OID 992540)
-- Name: payments payments_stripe_payment_intent_id_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key22 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5965 (class 2606 OID 992586)
-- Name: payments payments_stripe_payment_intent_id_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key23 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5967 (class 2606 OID 992538)
-- Name: payments payments_stripe_payment_intent_id_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key24 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5969 (class 2606 OID 992588)
-- Name: payments payments_stripe_payment_intent_id_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key25 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5971 (class 2606 OID 992536)
-- Name: payments payments_stripe_payment_intent_id_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key26 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5973 (class 2606 OID 992590)
-- Name: payments payments_stripe_payment_intent_id_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key27 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5975 (class 2606 OID 992592)
-- Name: payments payments_stripe_payment_intent_id_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key28 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5977 (class 2606 OID 992534)
-- Name: payments payments_stripe_payment_intent_id_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key29 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5979 (class 2606 OID 992556)
-- Name: payments payments_stripe_payment_intent_id_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key3 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5981 (class 2606 OID 992594)
-- Name: payments payments_stripe_payment_intent_id_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key30 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5983 (class 2606 OID 992532)
-- Name: payments payments_stripe_payment_intent_id_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key31 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5985 (class 2606 OID 992596)
-- Name: payments payments_stripe_payment_intent_id_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key32 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5987 (class 2606 OID 992598)
-- Name: payments payments_stripe_payment_intent_id_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key33 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5989 (class 2606 OID 992600)
-- Name: payments payments_stripe_payment_intent_id_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key34 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5991 (class 2606 OID 992530)
-- Name: payments payments_stripe_payment_intent_id_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key35 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5993 (class 2606 OID 992602)
-- Name: payments payments_stripe_payment_intent_id_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key36 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5995 (class 2606 OID 992528)
-- Name: payments payments_stripe_payment_intent_id_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key37 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5997 (class 2606 OID 992604)
-- Name: payments payments_stripe_payment_intent_id_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key38 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 5999 (class 2606 OID 992526)
-- Name: payments payments_stripe_payment_intent_id_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key39 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6001 (class 2606 OID 992554)
-- Name: payments payments_stripe_payment_intent_id_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key4 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6003 (class 2606 OID 992606)
-- Name: payments payments_stripe_payment_intent_id_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key40 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6005 (class 2606 OID 992432)
-- Name: payments payments_stripe_payment_intent_id_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key41 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6007 (class 2606 OID 992522)
-- Name: payments payments_stripe_payment_intent_id_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key42 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6009 (class 2606 OID 992434)
-- Name: payments payments_stripe_payment_intent_id_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key43 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6011 (class 2606 OID 992520)
-- Name: payments payments_stripe_payment_intent_id_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key44 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6013 (class 2606 OID 992518)
-- Name: payments payments_stripe_payment_intent_id_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key45 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6015 (class 2606 OID 992436)
-- Name: payments payments_stripe_payment_intent_id_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key46 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6017 (class 2606 OID 992516)
-- Name: payments payments_stripe_payment_intent_id_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key47 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6019 (class 2606 OID 992438)
-- Name: payments payments_stripe_payment_intent_id_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key48 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6021 (class 2606 OID 992514)
-- Name: payments payments_stripe_payment_intent_id_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key49 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6023 (class 2606 OID 992564)
-- Name: payments payments_stripe_payment_intent_id_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key5 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6025 (class 2606 OID 992440)
-- Name: payments payments_stripe_payment_intent_id_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key50 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6027 (class 2606 OID 992512)
-- Name: payments payments_stripe_payment_intent_id_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key51 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6029 (class 2606 OID 992442)
-- Name: payments payments_stripe_payment_intent_id_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key52 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6031 (class 2606 OID 992510)
-- Name: payments payments_stripe_payment_intent_id_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key53 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6033 (class 2606 OID 992444)
-- Name: payments payments_stripe_payment_intent_id_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key54 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6035 (class 2606 OID 992508)
-- Name: payments payments_stripe_payment_intent_id_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key55 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6037 (class 2606 OID 992446)
-- Name: payments payments_stripe_payment_intent_id_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key56 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6039 (class 2606 OID 992506)
-- Name: payments payments_stripe_payment_intent_id_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key57 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6041 (class 2606 OID 992474)
-- Name: payments payments_stripe_payment_intent_id_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key58 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6043 (class 2606 OID 992504)
-- Name: payments payments_stripe_payment_intent_id_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key59 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6045 (class 2606 OID 992566)
-- Name: payments payments_stripe_payment_intent_id_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key6 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6047 (class 2606 OID 992476)
-- Name: payments payments_stripe_payment_intent_id_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key60 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6049 (class 2606 OID 992502)
-- Name: payments payments_stripe_payment_intent_id_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key61 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6051 (class 2606 OID 992478)
-- Name: payments payments_stripe_payment_intent_id_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key62 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6053 (class 2606 OID 992500)
-- Name: payments payments_stripe_payment_intent_id_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key63 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6055 (class 2606 OID 992498)
-- Name: payments payments_stripe_payment_intent_id_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key64 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6057 (class 2606 OID 992480)
-- Name: payments payments_stripe_payment_intent_id_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key65 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6059 (class 2606 OID 992496)
-- Name: payments payments_stripe_payment_intent_id_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key66 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6061 (class 2606 OID 992482)
-- Name: payments payments_stripe_payment_intent_id_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key67 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6063 (class 2606 OID 992494)
-- Name: payments payments_stripe_payment_intent_id_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key68 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6065 (class 2606 OID 992484)
-- Name: payments payments_stripe_payment_intent_id_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key69 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6067 (class 2606 OID 992552)
-- Name: payments payments_stripe_payment_intent_id_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key7 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6069 (class 2606 OID 992492)
-- Name: payments payments_stripe_payment_intent_id_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key70 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6071 (class 2606 OID 992486)
-- Name: payments payments_stripe_payment_intent_id_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key71 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6073 (class 2606 OID 992524)
-- Name: payments payments_stripe_payment_intent_id_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key72 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6075 (class 2606 OID 992490)
-- Name: payments payments_stripe_payment_intent_id_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key73 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6077 (class 2606 OID 992488)
-- Name: payments payments_stripe_payment_intent_id_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key74 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6079 (class 2606 OID 992448)
-- Name: payments payments_stripe_payment_intent_id_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key75 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6081 (class 2606 OID 992472)
-- Name: payments payments_stripe_payment_intent_id_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key76 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6083 (class 2606 OID 992450)
-- Name: payments payments_stripe_payment_intent_id_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key77 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6085 (class 2606 OID 992452)
-- Name: payments payments_stripe_payment_intent_id_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key78 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6087 (class 2606 OID 992454)
-- Name: payments payments_stripe_payment_intent_id_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key79 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6089 (class 2606 OID 992568)
-- Name: payments payments_stripe_payment_intent_id_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key8 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6091 (class 2606 OID 992470)
-- Name: payments payments_stripe_payment_intent_id_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key80 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6093 (class 2606 OID 992456)
-- Name: payments payments_stripe_payment_intent_id_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key81 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6095 (class 2606 OID 992468)
-- Name: payments payments_stripe_payment_intent_id_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key82 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6097 (class 2606 OID 992458)
-- Name: payments payments_stripe_payment_intent_id_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key83 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6099 (class 2606 OID 992460)
-- Name: payments payments_stripe_payment_intent_id_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key84 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6101 (class 2606 OID 992466)
-- Name: payments payments_stripe_payment_intent_id_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key85 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6103 (class 2606 OID 992462)
-- Name: payments payments_stripe_payment_intent_id_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key86 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6105 (class 2606 OID 992464)
-- Name: payments payments_stripe_payment_intent_id_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key87 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6107 (class 2606 OID 992608)
-- Name: payments payments_stripe_payment_intent_id_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key88 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6109 (class 2606 OID 992610)
-- Name: payments payments_stripe_payment_intent_id_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key89 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6111 (class 2606 OID 992550)
-- Name: payments payments_stripe_payment_intent_id_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_stripe_payment_intent_id_key9 UNIQUE (stripe_payment_intent_id);


--
-- TOC entry 6114 (class 2606 OID 992292)
-- Name: payments payments_transaction_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key UNIQUE (transaction_id);


--
-- TOC entry 6116 (class 2606 OID 992290)
-- Name: payments payments_transaction_id_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key1 UNIQUE (transaction_id);


--
-- TOC entry 6118 (class 2606 OID 992314)
-- Name: payments payments_transaction_id_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key10 UNIQUE (transaction_id);


--
-- TOC entry 6120 (class 2606 OID 992316)
-- Name: payments payments_transaction_id_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key11 UNIQUE (transaction_id);


--
-- TOC entry 6122 (class 2606 OID 992318)
-- Name: payments payments_transaction_id_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key12 UNIQUE (transaction_id);


--
-- TOC entry 6124 (class 2606 OID 992368)
-- Name: payments payments_transaction_id_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key13 UNIQUE (transaction_id);


--
-- TOC entry 6126 (class 2606 OID 992320)
-- Name: payments payments_transaction_id_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key14 UNIQUE (transaction_id);


--
-- TOC entry 6128 (class 2606 OID 992366)
-- Name: payments payments_transaction_id_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key15 UNIQUE (transaction_id);


--
-- TOC entry 6130 (class 2606 OID 992322)
-- Name: payments payments_transaction_id_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key16 UNIQUE (transaction_id);


--
-- TOC entry 6132 (class 2606 OID 992364)
-- Name: payments payments_transaction_id_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key17 UNIQUE (transaction_id);


--
-- TOC entry 6134 (class 2606 OID 992324)
-- Name: payments payments_transaction_id_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key18 UNIQUE (transaction_id);


--
-- TOC entry 6136 (class 2606 OID 992362)
-- Name: payments payments_transaction_id_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key19 UNIQUE (transaction_id);


--
-- TOC entry 6138 (class 2606 OID 992294)
-- Name: payments payments_transaction_id_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key2 UNIQUE (transaction_id);


--
-- TOC entry 6140 (class 2606 OID 992326)
-- Name: payments payments_transaction_id_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key20 UNIQUE (transaction_id);


--
-- TOC entry 6142 (class 2606 OID 992378)
-- Name: payments payments_transaction_id_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key21 UNIQUE (transaction_id);


--
-- TOC entry 6144 (class 2606 OID 992360)
-- Name: payments payments_transaction_id_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key22 UNIQUE (transaction_id);


--
-- TOC entry 6146 (class 2606 OID 992380)
-- Name: payments payments_transaction_id_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key23 UNIQUE (transaction_id);


--
-- TOC entry 6148 (class 2606 OID 992344)
-- Name: payments payments_transaction_id_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key24 UNIQUE (transaction_id);


--
-- TOC entry 6150 (class 2606 OID 992382)
-- Name: payments payments_transaction_id_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key25 UNIQUE (transaction_id);


--
-- TOC entry 6152 (class 2606 OID 992342)
-- Name: payments payments_transaction_id_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key26 UNIQUE (transaction_id);


--
-- TOC entry 6154 (class 2606 OID 992384)
-- Name: payments payments_transaction_id_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key27 UNIQUE (transaction_id);


--
-- TOC entry 6156 (class 2606 OID 992268)
-- Name: payments payments_transaction_id_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key28 UNIQUE (transaction_id);


--
-- TOC entry 6158 (class 2606 OID 992340)
-- Name: payments payments_transaction_id_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key29 UNIQUE (transaction_id);


--
-- TOC entry 6160 (class 2606 OID 992288)
-- Name: payments payments_transaction_id_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key3 UNIQUE (transaction_id);


--
-- TOC entry 6162 (class 2606 OID 992270)
-- Name: payments payments_transaction_id_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key30 UNIQUE (transaction_id);


--
-- TOC entry 6164 (class 2606 OID 992296)
-- Name: payments payments_transaction_id_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key31 UNIQUE (transaction_id);


--
-- TOC entry 6166 (class 2606 OID 992272)
-- Name: payments payments_transaction_id_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key32 UNIQUE (transaction_id);


--
-- TOC entry 6168 (class 2606 OID 992274)
-- Name: payments payments_transaction_id_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key33 UNIQUE (transaction_id);


--
-- TOC entry 6170 (class 2606 OID 992276)
-- Name: payments payments_transaction_id_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key34 UNIQUE (transaction_id);


--
-- TOC entry 6172 (class 2606 OID 992338)
-- Name: payments payments_transaction_id_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key35 UNIQUE (transaction_id);


--
-- TOC entry 6174 (class 2606 OID 992278)
-- Name: payments payments_transaction_id_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key36 UNIQUE (transaction_id);


--
-- TOC entry 6176 (class 2606 OID 992334)
-- Name: payments payments_transaction_id_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key37 UNIQUE (transaction_id);


--
-- TOC entry 6178 (class 2606 OID 992280)
-- Name: payments payments_transaction_id_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key38 UNIQUE (transaction_id);


--
-- TOC entry 6180 (class 2606 OID 992332)
-- Name: payments payments_transaction_id_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key39 UNIQUE (transaction_id);


--
-- TOC entry 6182 (class 2606 OID 992376)
-- Name: payments payments_transaction_id_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key4 UNIQUE (transaction_id);


--
-- TOC entry 6184 (class 2606 OID 992282)
-- Name: payments payments_transaction_id_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key40 UNIQUE (transaction_id);


--
-- TOC entry 6186 (class 2606 OID 992284)
-- Name: payments payments_transaction_id_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key41 UNIQUE (transaction_id);


--
-- TOC entry 6188 (class 2606 OID 992330)
-- Name: payments payments_transaction_id_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key42 UNIQUE (transaction_id);


--
-- TOC entry 6190 (class 2606 OID 992328)
-- Name: payments payments_transaction_id_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key43 UNIQUE (transaction_id);


--
-- TOC entry 6192 (class 2606 OID 992372)
-- Name: payments payments_transaction_id_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key44 UNIQUE (transaction_id);


--
-- TOC entry 6194 (class 2606 OID 992286)
-- Name: payments payments_transaction_id_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key45 UNIQUE (transaction_id);


--
-- TOC entry 6196 (class 2606 OID 992386)
-- Name: payments payments_transaction_id_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key46 UNIQUE (transaction_id);


--
-- TOC entry 6198 (class 2606 OID 992266)
-- Name: payments payments_transaction_id_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key47 UNIQUE (transaction_id);


--
-- TOC entry 6200 (class 2606 OID 992388)
-- Name: payments payments_transaction_id_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key48 UNIQUE (transaction_id);


--
-- TOC entry 6202 (class 2606 OID 992264)
-- Name: payments payments_transaction_id_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key49 UNIQUE (transaction_id);


--
-- TOC entry 6204 (class 2606 OID 992308)
-- Name: payments payments_transaction_id_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key5 UNIQUE (transaction_id);


--
-- TOC entry 6206 (class 2606 OID 992390)
-- Name: payments payments_transaction_id_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key50 UNIQUE (transaction_id);


--
-- TOC entry 6208 (class 2606 OID 992396)
-- Name: payments payments_transaction_id_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key51 UNIQUE (transaction_id);


--
-- TOC entry 6210 (class 2606 OID 992392)
-- Name: payments payments_transaction_id_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key52 UNIQUE (transaction_id);


--
-- TOC entry 6212 (class 2606 OID 992394)
-- Name: payments payments_transaction_id_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key53 UNIQUE (transaction_id);


--
-- TOC entry 6214 (class 2606 OID 992346)
-- Name: payments payments_transaction_id_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key54 UNIQUE (transaction_id);


--
-- TOC entry 6216 (class 2606 OID 992358)
-- Name: payments payments_transaction_id_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key55 UNIQUE (transaction_id);


--
-- TOC entry 6218 (class 2606 OID 992348)
-- Name: payments payments_transaction_id_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key56 UNIQUE (transaction_id);


--
-- TOC entry 6220 (class 2606 OID 992356)
-- Name: payments payments_transaction_id_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key57 UNIQUE (transaction_id);


--
-- TOC entry 6222 (class 2606 OID 992350)
-- Name: payments payments_transaction_id_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key58 UNIQUE (transaction_id);


--
-- TOC entry 6224 (class 2606 OID 992352)
-- Name: payments payments_transaction_id_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key59 UNIQUE (transaction_id);


--
-- TOC entry 6226 (class 2606 OID 992310)
-- Name: payments payments_transaction_id_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key6 UNIQUE (transaction_id);


--
-- TOC entry 6228 (class 2606 OID 992354)
-- Name: payments payments_transaction_id_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key60 UNIQUE (transaction_id);


--
-- TOC entry 6230 (class 2606 OID 992306)
-- Name: payments payments_transaction_id_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key61 UNIQUE (transaction_id);


--
-- TOC entry 6232 (class 2606 OID 992298)
-- Name: payments payments_transaction_id_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key62 UNIQUE (transaction_id);


--
-- TOC entry 6234 (class 2606 OID 992304)
-- Name: payments payments_transaction_id_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key63 UNIQUE (transaction_id);


--
-- TOC entry 6236 (class 2606 OID 992300)
-- Name: payments payments_transaction_id_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key64 UNIQUE (transaction_id);


--
-- TOC entry 6238 (class 2606 OID 992302)
-- Name: payments payments_transaction_id_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key65 UNIQUE (transaction_id);


--
-- TOC entry 6240 (class 2606 OID 992262)
-- Name: payments payments_transaction_id_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key66 UNIQUE (transaction_id);


--
-- TOC entry 6242 (class 2606 OID 992398)
-- Name: payments payments_transaction_id_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key67 UNIQUE (transaction_id);


--
-- TOC entry 6244 (class 2606 OID 992260)
-- Name: payments payments_transaction_id_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key68 UNIQUE (transaction_id);


--
-- TOC entry 6246 (class 2606 OID 992400)
-- Name: payments payments_transaction_id_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key69 UNIQUE (transaction_id);


--
-- TOC entry 6248 (class 2606 OID 992374)
-- Name: payments payments_transaction_id_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key7 UNIQUE (transaction_id);


--
-- TOC entry 6250 (class 2606 OID 992258)
-- Name: payments payments_transaction_id_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key70 UNIQUE (transaction_id);


--
-- TOC entry 6252 (class 2606 OID 992402)
-- Name: payments payments_transaction_id_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key71 UNIQUE (transaction_id);


--
-- TOC entry 6254 (class 2606 OID 992256)
-- Name: payments payments_transaction_id_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key72 UNIQUE (transaction_id);


--
-- TOC entry 6256 (class 2606 OID 992336)
-- Name: payments payments_transaction_id_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key73 UNIQUE (transaction_id);


--
-- TOC entry 6258 (class 2606 OID 992254)
-- Name: payments payments_transaction_id_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key74 UNIQUE (transaction_id);


--
-- TOC entry 6260 (class 2606 OID 992404)
-- Name: payments payments_transaction_id_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key75 UNIQUE (transaction_id);


--
-- TOC entry 6262 (class 2606 OID 992252)
-- Name: payments payments_transaction_id_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key76 UNIQUE (transaction_id);


--
-- TOC entry 6264 (class 2606 OID 992406)
-- Name: payments payments_transaction_id_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key77 UNIQUE (transaction_id);


--
-- TOC entry 6266 (class 2606 OID 992408)
-- Name: payments payments_transaction_id_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key78 UNIQUE (transaction_id);


--
-- TOC entry 6268 (class 2606 OID 992410)
-- Name: payments payments_transaction_id_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key79 UNIQUE (transaction_id);


--
-- TOC entry 6270 (class 2606 OID 992312)
-- Name: payments payments_transaction_id_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key8 UNIQUE (transaction_id);


--
-- TOC entry 6272 (class 2606 OID 992250)
-- Name: payments payments_transaction_id_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key80 UNIQUE (transaction_id);


--
-- TOC entry 6274 (class 2606 OID 992412)
-- Name: payments payments_transaction_id_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key81 UNIQUE (transaction_id);


--
-- TOC entry 6276 (class 2606 OID 992248)
-- Name: payments payments_transaction_id_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key82 UNIQUE (transaction_id);


--
-- TOC entry 6278 (class 2606 OID 992414)
-- Name: payments payments_transaction_id_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key83 UNIQUE (transaction_id);


--
-- TOC entry 6280 (class 2606 OID 992416)
-- Name: payments payments_transaction_id_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key84 UNIQUE (transaction_id);


--
-- TOC entry 6282 (class 2606 OID 992246)
-- Name: payments payments_transaction_id_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key85 UNIQUE (transaction_id);


--
-- TOC entry 6284 (class 2606 OID 992418)
-- Name: payments payments_transaction_id_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key86 UNIQUE (transaction_id);


--
-- TOC entry 6286 (class 2606 OID 992244)
-- Name: payments payments_transaction_id_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key87 UNIQUE (transaction_id);


--
-- TOC entry 6288 (class 2606 OID 992420)
-- Name: payments payments_transaction_id_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key88 UNIQUE (transaction_id);


--
-- TOC entry 6290 (class 2606 OID 992422)
-- Name: payments payments_transaction_id_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key89 UNIQUE (transaction_id);


--
-- TOC entry 6292 (class 2606 OID 992370)
-- Name: payments payments_transaction_id_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key9 UNIQUE (transaction_id);


--
-- TOC entry 5921 (class 2606 OID 714768)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 5351 (class 2606 OID 714661)
-- Name: tour_packages tour_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_packages
    ADD CONSTRAINT tour_packages_pkey PRIMARY KEY (id);


--
-- TOC entry 4777 (class 2606 OID 991144)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4779 (class 2606 OID 991146)
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- TOC entry 4781 (class 2606 OID 991514)
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- TOC entry 4783 (class 2606 OID 991070)
-- Name: users users_email_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key100 UNIQUE (email);


--
-- TOC entry 4785 (class 2606 OID 991182)
-- Name: users users_email_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key101 UNIQUE (email);


--
-- TOC entry 4787 (class 2606 OID 991068)
-- Name: users users_email_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key102 UNIQUE (email);


--
-- TOC entry 4789 (class 2606 OID 991314)
-- Name: users users_email_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key103 UNIQUE (email);


--
-- TOC entry 4791 (class 2606 OID 991312)
-- Name: users users_email_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key104 UNIQUE (email);


--
-- TOC entry 4793 (class 2606 OID 991184)
-- Name: users users_email_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key105 UNIQUE (email);


--
-- TOC entry 4795 (class 2606 OID 991310)
-- Name: users users_email_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key106 UNIQUE (email);


--
-- TOC entry 4797 (class 2606 OID 991308)
-- Name: users users_email_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key107 UNIQUE (email);


--
-- TOC entry 4799 (class 2606 OID 991306)
-- Name: users users_email_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key108 UNIQUE (email);


--
-- TOC entry 4801 (class 2606 OID 991304)
-- Name: users users_email_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key109 UNIQUE (email);


--
-- TOC entry 4803 (class 2606 OID 991512)
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- TOC entry 4805 (class 2606 OID 991302)
-- Name: users users_email_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key110 UNIQUE (email);


--
-- TOC entry 4807 (class 2606 OID 991588)
-- Name: users users_email_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key111 UNIQUE (email);


--
-- TOC entry 4809 (class 2606 OID 991586)
-- Name: users users_email_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key112 UNIQUE (email);


--
-- TOC entry 4811 (class 2606 OID 991584)
-- Name: users users_email_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key113 UNIQUE (email);


--
-- TOC entry 4813 (class 2606 OID 991582)
-- Name: users users_email_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key114 UNIQUE (email);


--
-- TOC entry 4815 (class 2606 OID 991580)
-- Name: users users_email_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key115 UNIQUE (email);


--
-- TOC entry 4817 (class 2606 OID 991578)
-- Name: users users_email_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key116 UNIQUE (email);


--
-- TOC entry 4819 (class 2606 OID 991576)
-- Name: users users_email_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key117 UNIQUE (email);


--
-- TOC entry 4821 (class 2606 OID 991574)
-- Name: users users_email_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key118 UNIQUE (email);


--
-- TOC entry 4823 (class 2606 OID 991572)
-- Name: users users_email_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key119 UNIQUE (email);


--
-- TOC entry 4825 (class 2606 OID 991226)
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- TOC entry 4827 (class 2606 OID 991570)
-- Name: users users_email_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key120 UNIQUE (email);


--
-- TOC entry 4829 (class 2606 OID 991568)
-- Name: users users_email_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key121 UNIQUE (email);


--
-- TOC entry 4831 (class 2606 OID 991566)
-- Name: users users_email_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key122 UNIQUE (email);


--
-- TOC entry 4833 (class 2606 OID 991564)
-- Name: users users_email_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key123 UNIQUE (email);


--
-- TOC entry 4835 (class 2606 OID 991562)
-- Name: users users_email_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key124 UNIQUE (email);


--
-- TOC entry 4837 (class 2606 OID 991560)
-- Name: users users_email_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key125 UNIQUE (email);


--
-- TOC entry 4839 (class 2606 OID 991558)
-- Name: users users_email_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key126 UNIQUE (email);


--
-- TOC entry 4841 (class 2606 OID 991556)
-- Name: users users_email_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key127 UNIQUE (email);


--
-- TOC entry 4843 (class 2606 OID 991554)
-- Name: users users_email_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key128 UNIQUE (email);


--
-- TOC entry 4845 (class 2606 OID 991552)
-- Name: users users_email_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key129 UNIQUE (email);


--
-- TOC entry 4847 (class 2606 OID 991228)
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- TOC entry 4849 (class 2606 OID 991550)
-- Name: users users_email_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key130 UNIQUE (email);


--
-- TOC entry 4851 (class 2606 OID 991548)
-- Name: users users_email_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key131 UNIQUE (email);


--
-- TOC entry 4853 (class 2606 OID 991546)
-- Name: users users_email_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key132 UNIQUE (email);


--
-- TOC entry 4855 (class 2606 OID 991544)
-- Name: users users_email_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key133 UNIQUE (email);


--
-- TOC entry 4857 (class 2606 OID 991542)
-- Name: users users_email_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key134 UNIQUE (email);


--
-- TOC entry 4859 (class 2606 OID 991186)
-- Name: users users_email_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key135 UNIQUE (email);


--
-- TOC entry 4861 (class 2606 OID 991202)
-- Name: users users_email_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key136 UNIQUE (email);


--
-- TOC entry 4863 (class 2606 OID 991200)
-- Name: users users_email_key137; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key137 UNIQUE (email);


--
-- TOC entry 4865 (class 2606 OID 991188)
-- Name: users users_email_key138; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key138 UNIQUE (email);


--
-- TOC entry 4867 (class 2606 OID 991198)
-- Name: users users_email_key139; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key139 UNIQUE (email);


--
-- TOC entry 4869 (class 2606 OID 991510)
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- TOC entry 4871 (class 2606 OID 991196)
-- Name: users users_email_key140; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key140 UNIQUE (email);


--
-- TOC entry 4873 (class 2606 OID 991194)
-- Name: users users_email_key141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key141 UNIQUE (email);


--
-- TOC entry 4875 (class 2606 OID 991192)
-- Name: users users_email_key142; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key142 UNIQUE (email);


--
-- TOC entry 4877 (class 2606 OID 991190)
-- Name: users users_email_key143; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key143 UNIQUE (email);


--
-- TOC entry 4879 (class 2606 OID 991074)
-- Name: users users_email_key144; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key144 UNIQUE (email);


--
-- TOC entry 4881 (class 2606 OID 991462)
-- Name: users users_email_key145; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key145 UNIQUE (email);


--
-- TOC entry 4883 (class 2606 OID 991076)
-- Name: users users_email_key146; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key146 UNIQUE (email);


--
-- TOC entry 4885 (class 2606 OID 991460)
-- Name: users users_email_key147; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key147 UNIQUE (email);


--
-- TOC entry 4887 (class 2606 OID 991078)
-- Name: users users_email_key148; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key148 UNIQUE (email);


--
-- TOC entry 4889 (class 2606 OID 991458)
-- Name: users users_email_key149; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key149 UNIQUE (email);


--
-- TOC entry 4891 (class 2606 OID 991230)
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- TOC entry 4893 (class 2606 OID 991456)
-- Name: users users_email_key150; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key150 UNIQUE (email);


--
-- TOC entry 4895 (class 2606 OID 991454)
-- Name: users users_email_key151; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key151 UNIQUE (email);


--
-- TOC entry 4897 (class 2606 OID 991452)
-- Name: users users_email_key152; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key152 UNIQUE (email);


--
-- TOC entry 4899 (class 2606 OID 991450)
-- Name: users users_email_key153; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key153 UNIQUE (email);


--
-- TOC entry 4901 (class 2606 OID 991448)
-- Name: users users_email_key154; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key154 UNIQUE (email);


--
-- TOC entry 4903 (class 2606 OID 991080)
-- Name: users users_email_key155; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key155 UNIQUE (email);


--
-- TOC entry 4905 (class 2606 OID 991446)
-- Name: users users_email_key156; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key156 UNIQUE (email);


--
-- TOC entry 4907 (class 2606 OID 991444)
-- Name: users users_email_key157; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key157 UNIQUE (email);


--
-- TOC entry 4909 (class 2606 OID 991082)
-- Name: users users_email_key158; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key158 UNIQUE (email);


--
-- TOC entry 4911 (class 2606 OID 991442)
-- Name: users users_email_key159; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key159 UNIQUE (email);


--
-- TOC entry 4913 (class 2606 OID 991508)
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- TOC entry 4915 (class 2606 OID 991084)
-- Name: users users_email_key160; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key160 UNIQUE (email);


--
-- TOC entry 4917 (class 2606 OID 991440)
-- Name: users users_email_key161; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key161 UNIQUE (email);


--
-- TOC entry 4919 (class 2606 OID 991438)
-- Name: users users_email_key162; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key162 UNIQUE (email);


--
-- TOC entry 4921 (class 2606 OID 991436)
-- Name: users users_email_key163; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key163 UNIQUE (email);


--
-- TOC entry 4923 (class 2606 OID 991434)
-- Name: users users_email_key164; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key164 UNIQUE (email);


--
-- TOC entry 4925 (class 2606 OID 991432)
-- Name: users users_email_key165; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key165 UNIQUE (email);


--
-- TOC entry 4927 (class 2606 OID 991430)
-- Name: users users_email_key166; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key166 UNIQUE (email);


--
-- TOC entry 4929 (class 2606 OID 991316)
-- Name: users users_email_key167; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key167 UNIQUE (email);


--
-- TOC entry 4931 (class 2606 OID 991318)
-- Name: users users_email_key168; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key168 UNIQUE (email);


--
-- TOC entry 4933 (class 2606 OID 991428)
-- Name: users users_email_key169; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key169 UNIQUE (email);


--
-- TOC entry 4935 (class 2606 OID 991506)
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- TOC entry 4937 (class 2606 OID 991426)
-- Name: users users_email_key170; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key170 UNIQUE (email);


--
-- TOC entry 4939 (class 2606 OID 991424)
-- Name: users users_email_key171; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key171 UNIQUE (email);


--
-- TOC entry 4941 (class 2606 OID 991320)
-- Name: users users_email_key172; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key172 UNIQUE (email);


--
-- TOC entry 4943 (class 2606 OID 991322)
-- Name: users users_email_key173; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key173 UNIQUE (email);


--
-- TOC entry 4945 (class 2606 OID 991354)
-- Name: users users_email_key174; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key174 UNIQUE (email);


--
-- TOC entry 4947 (class 2606 OID 991352)
-- Name: users users_email_key175; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key175 UNIQUE (email);


--
-- TOC entry 4949 (class 2606 OID 991324)
-- Name: users users_email_key176; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key176 UNIQUE (email);


--
-- TOC entry 4951 (class 2606 OID 991498)
-- Name: users users_email_key177; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key177 UNIQUE (email);


--
-- TOC entry 4953 (class 2606 OID 991496)
-- Name: users users_email_key178; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key178 UNIQUE (email);


--
-- TOC entry 4955 (class 2606 OID 991298)
-- Name: users users_email_key179; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key179 UNIQUE (email);


--
-- TOC entry 4957 (class 2606 OID 991232)
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- TOC entry 4959 (class 2606 OID 991296)
-- Name: users users_email_key180; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key180 UNIQUE (email);


--
-- TOC entry 4961 (class 2606 OID 991294)
-- Name: users users_email_key181; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key181 UNIQUE (email);


--
-- TOC entry 4963 (class 2606 OID 991292)
-- Name: users users_email_key182; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key182 UNIQUE (email);


--
-- TOC entry 4965 (class 2606 OID 991422)
-- Name: users users_email_key183; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key183 UNIQUE (email);


--
-- TOC entry 4967 (class 2606 OID 991420)
-- Name: users users_email_key184; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key184 UNIQUE (email);


--
-- TOC entry 4969 (class 2606 OID 991418)
-- Name: users users_email_key185; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key185 UNIQUE (email);


--
-- TOC entry 4971 (class 2606 OID 991326)
-- Name: users users_email_key186; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key186 UNIQUE (email);


--
-- TOC entry 4973 (class 2606 OID 991416)
-- Name: users users_email_key187; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key187 UNIQUE (email);


--
-- TOC entry 4975 (class 2606 OID 991414)
-- Name: users users_email_key188; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key188 UNIQUE (email);


--
-- TOC entry 4977 (class 2606 OID 991412)
-- Name: users users_email_key189; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key189 UNIQUE (email);


--
-- TOC entry 4979 (class 2606 OID 991504)
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- TOC entry 4981 (class 2606 OID 991410)
-- Name: users users_email_key190; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key190 UNIQUE (email);


--
-- TOC entry 4983 (class 2606 OID 991408)
-- Name: users users_email_key191; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key191 UNIQUE (email);


--
-- TOC entry 4985 (class 2606 OID 991406)
-- Name: users users_email_key192; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key192 UNIQUE (email);


--
-- TOC entry 4987 (class 2606 OID 991404)
-- Name: users users_email_key193; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key193 UNIQUE (email);


--
-- TOC entry 4989 (class 2606 OID 991402)
-- Name: users users_email_key194; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key194 UNIQUE (email);


--
-- TOC entry 4991 (class 2606 OID 991400)
-- Name: users users_email_key195; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key195 UNIQUE (email);


--
-- TOC entry 4993 (class 2606 OID 991398)
-- Name: users users_email_key196; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key196 UNIQUE (email);


--
-- TOC entry 4995 (class 2606 OID 991396)
-- Name: users users_email_key197; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key197 UNIQUE (email);


--
-- TOC entry 4997 (class 2606 OID 991394)
-- Name: users users_email_key198; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key198 UNIQUE (email);


--
-- TOC entry 4999 (class 2606 OID 991392)
-- Name: users users_email_key199; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key199 UNIQUE (email);


--
-- TOC entry 5001 (class 2606 OID 991148)
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- TOC entry 5003 (class 2606 OID 991502)
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- TOC entry 5005 (class 2606 OID 991248)
-- Name: users users_email_key200; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key200 UNIQUE (email);


--
-- TOC entry 5007 (class 2606 OID 991246)
-- Name: users users_email_key201; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key201 UNIQUE (email);


--
-- TOC entry 5009 (class 2606 OID 991328)
-- Name: users users_email_key202; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key202 UNIQUE (email);


--
-- TOC entry 5011 (class 2606 OID 991330)
-- Name: users users_email_key203; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key203 UNIQUE (email);


--
-- TOC entry 5013 (class 2606 OID 991360)
-- Name: users users_email_key204; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key204 UNIQUE (email);


--
-- TOC entry 5015 (class 2606 OID 991358)
-- Name: users users_email_key205; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key205 UNIQUE (email);


--
-- TOC entry 5017 (class 2606 OID 991356)
-- Name: users users_email_key206; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key206 UNIQUE (email);


--
-- TOC entry 5019 (class 2606 OID 991332)
-- Name: users users_email_key207; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key207 UNIQUE (email);


--
-- TOC entry 5021 (class 2606 OID 991290)
-- Name: users users_email_key208; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key208 UNIQUE (email);


--
-- TOC entry 5023 (class 2606 OID 991288)
-- Name: users users_email_key209; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key209 UNIQUE (email);


--
-- TOC entry 5025 (class 2606 OID 991118)
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- TOC entry 5027 (class 2606 OID 991286)
-- Name: users users_email_key210; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key210 UNIQUE (email);


--
-- TOC entry 5029 (class 2606 OID 991140)
-- Name: users users_email_key211; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key211 UNIQUE (email);


--
-- TOC entry 5031 (class 2606 OID 991334)
-- Name: users users_email_key212; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key212 UNIQUE (email);


--
-- TOC entry 5033 (class 2606 OID 991130)
-- Name: users users_email_key213; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key213 UNIQUE (email);


--
-- TOC entry 5035 (class 2606 OID 991128)
-- Name: users users_email_key214; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key214 UNIQUE (email);


--
-- TOC entry 5037 (class 2606 OID 991126)
-- Name: users users_email_key215; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key215 UNIQUE (email);


--
-- TOC entry 5039 (class 2606 OID 991336)
-- Name: users users_email_key216; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key216 UNIQUE (email);


--
-- TOC entry 5041 (class 2606 OID 991350)
-- Name: users users_email_key217; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key217 UNIQUE (email);


--
-- TOC entry 5043 (class 2606 OID 991348)
-- Name: users users_email_key218; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key218 UNIQUE (email);


--
-- TOC entry 5045 (class 2606 OID 991338)
-- Name: users users_email_key219; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key219 UNIQUE (email);


--
-- TOC entry 5047 (class 2606 OID 991500)
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- TOC entry 5049 (class 2606 OID 991346)
-- Name: users users_email_key220; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key220 UNIQUE (email);


--
-- TOC entry 5051 (class 2606 OID 991344)
-- Name: users users_email_key221; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key221 UNIQUE (email);


--
-- TOC entry 5053 (class 2606 OID 991342)
-- Name: users users_email_key222; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key222 UNIQUE (email);


--
-- TOC entry 5055 (class 2606 OID 991340)
-- Name: users users_email_key223; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key223 UNIQUE (email);


--
-- TOC entry 5057 (class 2606 OID 991250)
-- Name: users users_email_key224; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key224 UNIQUE (email);


--
-- TOC entry 5059 (class 2606 OID 991252)
-- Name: users users_email_key225; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key225 UNIQUE (email);


--
-- TOC entry 5061 (class 2606 OID 991390)
-- Name: users users_email_key226; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key226 UNIQUE (email);


--
-- TOC entry 5063 (class 2606 OID 991254)
-- Name: users users_email_key227; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key227 UNIQUE (email);


--
-- TOC entry 5065 (class 2606 OID 991388)
-- Name: users users_email_key228; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key228 UNIQUE (email);


--
-- TOC entry 5067 (class 2606 OID 991386)
-- Name: users users_email_key229; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key229 UNIQUE (email);


--
-- TOC entry 5069 (class 2606 OID 991120)
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- TOC entry 5071 (class 2606 OID 991384)
-- Name: users users_email_key230; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key230 UNIQUE (email);


--
-- TOC entry 5073 (class 2606 OID 991256)
-- Name: users users_email_key231; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key231 UNIQUE (email);


--
-- TOC entry 5075 (class 2606 OID 991258)
-- Name: users users_email_key232; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key232 UNIQUE (email);


--
-- TOC entry 5077 (class 2606 OID 991260)
-- Name: users users_email_key233; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key233 UNIQUE (email);


--
-- TOC entry 5079 (class 2606 OID 991284)
-- Name: users users_email_key234; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key234 UNIQUE (email);


--
-- TOC entry 5081 (class 2606 OID 991262)
-- Name: users users_email_key235; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key235 UNIQUE (email);


--
-- TOC entry 5083 (class 2606 OID 991282)
-- Name: users users_email_key236; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key236 UNIQUE (email);


--
-- TOC entry 5085 (class 2606 OID 991280)
-- Name: users users_email_key237; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key237 UNIQUE (email);


--
-- TOC entry 5087 (class 2606 OID 991278)
-- Name: users users_email_key238; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key238 UNIQUE (email);


--
-- TOC entry 5089 (class 2606 OID 991264)
-- Name: users users_email_key239; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key239 UNIQUE (email);


--
-- TOC entry 5091 (class 2606 OID 991124)
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- TOC entry 5093 (class 2606 OID 991276)
-- Name: users users_email_key240; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key240 UNIQUE (email);


--
-- TOC entry 5095 (class 2606 OID 991274)
-- Name: users users_email_key241; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key241 UNIQUE (email);


--
-- TOC entry 5097 (class 2606 OID 991272)
-- Name: users users_email_key242; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key242 UNIQUE (email);


--
-- TOC entry 5099 (class 2606 OID 991270)
-- Name: users users_email_key243; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key243 UNIQUE (email);


--
-- TOC entry 5101 (class 2606 OID 991268)
-- Name: users users_email_key244; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key244 UNIQUE (email);


--
-- TOC entry 5103 (class 2606 OID 991266)
-- Name: users users_email_key245; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key245 UNIQUE (email);


--
-- TOC entry 5105 (class 2606 OID 991300)
-- Name: users users_email_key246; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key246 UNIQUE (email);


--
-- TOC entry 5107 (class 2606 OID 991590)
-- Name: users users_email_key247; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key247 UNIQUE (email);


--
-- TOC entry 5109 (class 2606 OID 991592)
-- Name: users users_email_key248; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key248 UNIQUE (email);


--
-- TOC entry 5111 (class 2606 OID 991594)
-- Name: users users_email_key249; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key249 UNIQUE (email);


--
-- TOC entry 5113 (class 2606 OID 991122)
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- TOC entry 5115 (class 2606 OID 991596)
-- Name: users users_email_key250; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key250 UNIQUE (email);


--
-- TOC entry 5117 (class 2606 OID 991112)
-- Name: users users_email_key251; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key251 UNIQUE (email);


--
-- TOC entry 5119 (class 2606 OID 991598)
-- Name: users users_email_key252; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key252 UNIQUE (email);


--
-- TOC entry 5121 (class 2606 OID 991110)
-- Name: users users_email_key253; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key253 UNIQUE (email);


--
-- TOC entry 5123 (class 2606 OID 991600)
-- Name: users users_email_key254; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key254 UNIQUE (email);


--
-- TOC entry 5125 (class 2606 OID 991602)
-- Name: users users_email_key255; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key255 UNIQUE (email);


--
-- TOC entry 5127 (class 2606 OID 991108)
-- Name: users users_email_key256; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key256 UNIQUE (email);


--
-- TOC entry 5129 (class 2606 OID 991106)
-- Name: users users_email_key257; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key257 UNIQUE (email);


--
-- TOC entry 5131 (class 2606 OID 991604)
-- Name: users users_email_key258; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key258 UNIQUE (email);


--
-- TOC entry 5133 (class 2606 OID 991104)
-- Name: users users_email_key259; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key259 UNIQUE (email);


--
-- TOC entry 5135 (class 2606 OID 991116)
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- TOC entry 5137 (class 2606 OID 991606)
-- Name: users users_email_key260; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key260 UNIQUE (email);


--
-- TOC entry 5139 (class 2606 OID 991102)
-- Name: users users_email_key261; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key261 UNIQUE (email);


--
-- TOC entry 5141 (class 2606 OID 991608)
-- Name: users users_email_key262; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key262 UNIQUE (email);


--
-- TOC entry 5143 (class 2606 OID 991100)
-- Name: users users_email_key263; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key263 UNIQUE (email);


--
-- TOC entry 5145 (class 2606 OID 991098)
-- Name: users users_email_key264; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key264 UNIQUE (email);


--
-- TOC entry 5147 (class 2606 OID 991096)
-- Name: users users_email_key265; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key265 UNIQUE (email);


--
-- TOC entry 5149 (class 2606 OID 991094)
-- Name: users users_email_key266; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key266 UNIQUE (email);


--
-- TOC entry 5151 (class 2606 OID 991092)
-- Name: users users_email_key267; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key267 UNIQUE (email);


--
-- TOC entry 5153 (class 2606 OID 991090)
-- Name: users users_email_key268; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key268 UNIQUE (email);


--
-- TOC entry 5155 (class 2606 OID 991088)
-- Name: users users_email_key269; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key269 UNIQUE (email);


--
-- TOC entry 5157 (class 2606 OID 991234)
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- TOC entry 5159 (class 2606 OID 991086)
-- Name: users users_email_key270; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key270 UNIQUE (email);


--
-- TOC entry 5161 (class 2606 OID 991610)
-- Name: users users_email_key271; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key271 UNIQUE (email);


--
-- TOC entry 5163 (class 2606 OID 991066)
-- Name: users users_email_key272; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key272 UNIQUE (email);


--
-- TOC entry 5165 (class 2606 OID 991064)
-- Name: users users_email_key273; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key273 UNIQUE (email);


--
-- TOC entry 5167 (class 2606 OID 991612)
-- Name: users users_email_key274; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key274 UNIQUE (email);


--
-- TOC entry 5169 (class 2606 OID 991614)
-- Name: users users_email_key275; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key275 UNIQUE (email);


--
-- TOC entry 5171 (class 2606 OID 991062)
-- Name: users users_email_key276; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key276 UNIQUE (email);


--
-- TOC entry 5173 (class 2606 OID 991616)
-- Name: users users_email_key277; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key277 UNIQUE (email);


--
-- TOC entry 5175 (class 2606 OID 991618)
-- Name: users users_email_key278; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key278 UNIQUE (email);


--
-- TOC entry 5177 (class 2606 OID 991060)
-- Name: users users_email_key279; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key279 UNIQUE (email);


--
-- TOC entry 5179 (class 2606 OID 991244)
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- TOC entry 5181 (class 2606 OID 991058)
-- Name: users users_email_key280; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key280 UNIQUE (email);


--
-- TOC entry 5183 (class 2606 OID 991056)
-- Name: users users_email_key281; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key281 UNIQUE (email);


--
-- TOC entry 5185 (class 2606 OID 991054)
-- Name: users users_email_key282; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key282 UNIQUE (email);


--
-- TOC entry 5187 (class 2606 OID 991052)
-- Name: users users_email_key283; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key283 UNIQUE (email);


--
-- TOC entry 5189 (class 2606 OID 991620)
-- Name: users users_email_key284; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key284 UNIQUE (email);


--
-- TOC entry 5191 (class 2606 OID 991622)
-- Name: users users_email_key285; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key285 UNIQUE (email);


--
-- TOC entry 5193 (class 2606 OID 991236)
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- TOC entry 5195 (class 2606 OID 991218)
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- TOC entry 5197 (class 2606 OID 991242)
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- TOC entry 5199 (class 2606 OID 991238)
-- Name: users users_email_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key31 UNIQUE (email);


--
-- TOC entry 5201 (class 2606 OID 991240)
-- Name: users users_email_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key32 UNIQUE (email);


--
-- TOC entry 5203 (class 2606 OID 991520)
-- Name: users users_email_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key33 UNIQUE (email);


--
-- TOC entry 5205 (class 2606 OID 991382)
-- Name: users users_email_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key34 UNIQUE (email);


--
-- TOC entry 5207 (class 2606 OID 991522)
-- Name: users users_email_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key35 UNIQUE (email);


--
-- TOC entry 5209 (class 2606 OID 991380)
-- Name: users users_email_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key36 UNIQUE (email);


--
-- TOC entry 5211 (class 2606 OID 991150)
-- Name: users users_email_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key37 UNIQUE (email);


--
-- TOC entry 5213 (class 2606 OID 991540)
-- Name: users users_email_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key38 UNIQUE (email);


--
-- TOC entry 5215 (class 2606 OID 991538)
-- Name: users users_email_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key39 UNIQUE (email);


--
-- TOC entry 5217 (class 2606 OID 991142)
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- TOC entry 5219 (class 2606 OID 991152)
-- Name: users users_email_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key40 UNIQUE (email);


--
-- TOC entry 5221 (class 2606 OID 991536)
-- Name: users users_email_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key41 UNIQUE (email);


--
-- TOC entry 5223 (class 2606 OID 991132)
-- Name: users users_email_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key42 UNIQUE (email);


--
-- TOC entry 5225 (class 2606 OID 991534)
-- Name: users users_email_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key43 UNIQUE (email);


--
-- TOC entry 5227 (class 2606 OID 991134)
-- Name: users users_email_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key44 UNIQUE (email);


--
-- TOC entry 5229 (class 2606 OID 991532)
-- Name: users users_email_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key45 UNIQUE (email);


--
-- TOC entry 5231 (class 2606 OID 991136)
-- Name: users users_email_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key46 UNIQUE (email);


--
-- TOC entry 5233 (class 2606 OID 991138)
-- Name: users users_email_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key47 UNIQUE (email);


--
-- TOC entry 5235 (class 2606 OID 991530)
-- Name: users users_email_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key48 UNIQUE (email);


--
-- TOC entry 5237 (class 2606 OID 991154)
-- Name: users users_email_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key49 UNIQUE (email);


--
-- TOC entry 5239 (class 2606 OID 991220)
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- TOC entry 5241 (class 2606 OID 991156)
-- Name: users users_email_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key50 UNIQUE (email);


--
-- TOC entry 5243 (class 2606 OID 991528)
-- Name: users users_email_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key51 UNIQUE (email);


--
-- TOC entry 5245 (class 2606 OID 991158)
-- Name: users users_email_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key52 UNIQUE (email);


--
-- TOC entry 5247 (class 2606 OID 991526)
-- Name: users users_email_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key53 UNIQUE (email);


--
-- TOC entry 5249 (class 2606 OID 991160)
-- Name: users users_email_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key54 UNIQUE (email);


--
-- TOC entry 5251 (class 2606 OID 991524)
-- Name: users users_email_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key55 UNIQUE (email);


--
-- TOC entry 5253 (class 2606 OID 991162)
-- Name: users users_email_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key56 UNIQUE (email);


--
-- TOC entry 5255 (class 2606 OID 991164)
-- Name: users users_email_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key57 UNIQUE (email);


--
-- TOC entry 5257 (class 2606 OID 991216)
-- Name: users users_email_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key58 UNIQUE (email);


--
-- TOC entry 5259 (class 2606 OID 991166)
-- Name: users users_email_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key59 UNIQUE (email);


--
-- TOC entry 5261 (class 2606 OID 991518)
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- TOC entry 5263 (class 2606 OID 991168)
-- Name: users users_email_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key60 UNIQUE (email);


--
-- TOC entry 5265 (class 2606 OID 991214)
-- Name: users users_email_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key61 UNIQUE (email);


--
-- TOC entry 5267 (class 2606 OID 991212)
-- Name: users users_email_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key62 UNIQUE (email);


--
-- TOC entry 5269 (class 2606 OID 991210)
-- Name: users users_email_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key63 UNIQUE (email);


--
-- TOC entry 5271 (class 2606 OID 991208)
-- Name: users users_email_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key64 UNIQUE (email);


--
-- TOC entry 5273 (class 2606 OID 991206)
-- Name: users users_email_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key65 UNIQUE (email);


--
-- TOC entry 5275 (class 2606 OID 991204)
-- Name: users users_email_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key66 UNIQUE (email);


--
-- TOC entry 5277 (class 2606 OID 991378)
-- Name: users users_email_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key67 UNIQUE (email);


--
-- TOC entry 5279 (class 2606 OID 991376)
-- Name: users users_email_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key68 UNIQUE (email);


--
-- TOC entry 5281 (class 2606 OID 991374)
-- Name: users users_email_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key69 UNIQUE (email);


--
-- TOC entry 5283 (class 2606 OID 991222)
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- TOC entry 5285 (class 2606 OID 991372)
-- Name: users users_email_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key70 UNIQUE (email);


--
-- TOC entry 5287 (class 2606 OID 991370)
-- Name: users users_email_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key71 UNIQUE (email);


--
-- TOC entry 5289 (class 2606 OID 991170)
-- Name: users users_email_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key72 UNIQUE (email);


--
-- TOC entry 5291 (class 2606 OID 991368)
-- Name: users users_email_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key73 UNIQUE (email);


--
-- TOC entry 5293 (class 2606 OID 991366)
-- Name: users users_email_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key74 UNIQUE (email);


--
-- TOC entry 5295 (class 2606 OID 991364)
-- Name: users users_email_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key75 UNIQUE (email);


--
-- TOC entry 5297 (class 2606 OID 991362)
-- Name: users users_email_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key76 UNIQUE (email);


--
-- TOC entry 5299 (class 2606 OID 991114)
-- Name: users users_email_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key77 UNIQUE (email);


--
-- TOC entry 5301 (class 2606 OID 991172)
-- Name: users users_email_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key78 UNIQUE (email);


--
-- TOC entry 5303 (class 2606 OID 991494)
-- Name: users users_email_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key79 UNIQUE (email);


--
-- TOC entry 5305 (class 2606 OID 991516)
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- TOC entry 5307 (class 2606 OID 991492)
-- Name: users users_email_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key80 UNIQUE (email);


--
-- TOC entry 5309 (class 2606 OID 991490)
-- Name: users users_email_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key81 UNIQUE (email);


--
-- TOC entry 5311 (class 2606 OID 991488)
-- Name: users users_email_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key82 UNIQUE (email);


--
-- TOC entry 5313 (class 2606 OID 991486)
-- Name: users users_email_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key83 UNIQUE (email);


--
-- TOC entry 5315 (class 2606 OID 991174)
-- Name: users users_email_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key84 UNIQUE (email);


--
-- TOC entry 5317 (class 2606 OID 991484)
-- Name: users users_email_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key85 UNIQUE (email);


--
-- TOC entry 5319 (class 2606 OID 991482)
-- Name: users users_email_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key86 UNIQUE (email);


--
-- TOC entry 5321 (class 2606 OID 991480)
-- Name: users users_email_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key87 UNIQUE (email);


--
-- TOC entry 5323 (class 2606 OID 991478)
-- Name: users users_email_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key88 UNIQUE (email);


--
-- TOC entry 5325 (class 2606 OID 991476)
-- Name: users users_email_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key89 UNIQUE (email);


--
-- TOC entry 5327 (class 2606 OID 991224)
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- TOC entry 5329 (class 2606 OID 991474)
-- Name: users users_email_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key90 UNIQUE (email);


--
-- TOC entry 5331 (class 2606 OID 991472)
-- Name: users users_email_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key91 UNIQUE (email);


--
-- TOC entry 5333 (class 2606 OID 991470)
-- Name: users users_email_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key92 UNIQUE (email);


--
-- TOC entry 5335 (class 2606 OID 991176)
-- Name: users users_email_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key93 UNIQUE (email);


--
-- TOC entry 5337 (class 2606 OID 991468)
-- Name: users users_email_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key94 UNIQUE (email);


--
-- TOC entry 5339 (class 2606 OID 991178)
-- Name: users users_email_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key95 UNIQUE (email);


--
-- TOC entry 5341 (class 2606 OID 991466)
-- Name: users users_email_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key96 UNIQUE (email);


--
-- TOC entry 5343 (class 2606 OID 991180)
-- Name: users users_email_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key97 UNIQUE (email);


--
-- TOC entry 5345 (class 2606 OID 991464)
-- Name: users users_email_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key98 UNIQUE (email);


--
-- TOC entry 5347 (class 2606 OID 991072)
-- Name: users users_email_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key99 UNIQUE (email);


--
-- TOC entry 5349 (class 2606 OID 714619)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 6295 (class 1259 OID 992780)
-- Name: c2b_payments_trans_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX c2b_payments_trans_id ON public.c2b_payments USING btree (trans_id);


--
-- TOC entry 6460 (class 1259 OID 878609)
-- Name: idx_c2b_booking; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_c2b_booking ON public.c2b_payments USING btree (booking_id);


--
-- TOC entry 6461 (class 1259 OID 992781)
-- Name: idx_c2b_msisdn; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_c2b_msisdn ON public.c2b_payments USING btree (msisdn);


--
-- TOC entry 6464 (class 1259 OID 992804)
-- Name: idx_exp_expiry; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exp_expiry ON public.expected_payments USING btree (expires_at);


--
-- TOC entry 6465 (class 1259 OID 992803)
-- Name: idx_exp_phone_amt_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exp_phone_amt_status ON public.expected_payments USING btree (phone, amount, status);


--
-- TOC entry 5924 (class 1259 OID 871469)
-- Name: payments_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_booking_id ON public.payments USING btree (booking_id);


--
-- TOC entry 5925 (class 1259 OID 992613)
-- Name: payments_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_created_at ON public.payments USING btree (created_at);


--
-- TOC entry 5926 (class 1259 OID 992612)
-- Name: payments_mpesa_checkout_request_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_mpesa_checkout_request_id ON public.payments USING btree (mpesa_checkout_request_id);


--
-- TOC entry 5927 (class 1259 OID 992240)
-- Name: payments_payment_method; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_payment_method ON public.payments USING btree (payment_method);


--
-- TOC entry 5930 (class 1259 OID 992428)
-- Name: payments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_status ON public.payments USING btree (status);


--
-- TOC entry 5931 (class 1259 OID 992611)
-- Name: payments_stripe_payment_intent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX payments_stripe_payment_intent_id ON public.payments USING btree (stripe_payment_intent_id);


--
-- TOC entry 6112 (class 1259 OID 992423)
-- Name: payments_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX payments_transaction_id ON public.payments USING btree (transaction_id);


--
-- TOC entry 6469 (class 2606 OID 992230)
-- Name: booking_passengers booking_passengers_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_passengers
    ADD CONSTRAINT booking_passengers_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 6467 (class 2606 OID 992223)
-- Name: bookings bookings_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.tour_packages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 6468 (class 2606 OID 992218)
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 6473 (class 2606 OID 992782)
-- Name: c2b_payments c2b_payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 6474 (class 2606 OID 992789)
-- Name: c2b_payments c2b_payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.c2b_payments
    ADD CONSTRAINT c2b_payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 6475 (class 2606 OID 992796)
-- Name: expected_payments expected_payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expected_payments
    ADD CONSTRAINT expected_payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 6476 (class 2606 OID 992805)
-- Name: expected_payments expected_payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expected_payments
    ADD CONSTRAINT expected_payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 6466 (class 2606 OID 991645)
-- Name: package_images package_images_tour_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_images
    ADD CONSTRAINT package_images_tour_package_id_fkey FOREIGN KEY (tour_package_id) REFERENCES public.tour_packages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 6472 (class 2606 OID 992235)
-- Name: payments payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 6470 (class 2606 OID 992817)
-- Name: reviews reviews_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.tour_packages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 6471 (class 2606 OID 992812)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-03-06 01:33:22

--
-- PostgreSQL database dump complete
--

