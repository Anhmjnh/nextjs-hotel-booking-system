--
-- PostgreSQL database dump
--

\restrict c3EgefscrMjSdoJvSIbcXdcECkezazNmvwaQL8GO8ec0SttOjEhqBS6dRxbfxpe

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-19 17:59:18

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
-- TOC entry 5 (class 2615 OID 16709)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 873 (class 1247 OID 16726)
-- Name: BookingStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BookingStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED'
);


ALTER TYPE public."BookingStatus" OWNER TO postgres;

--
-- TOC entry 897 (class 1247 OID 25060)
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'ONLINE',
    'CASH'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- TOC entry 876 (class 1247 OID 16736)
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'UNPAID',
    'PAID',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- TOC entry 867 (class 1247 OID 16711)
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- TOC entry 870 (class 1247 OID 16716)
-- Name: RoomType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RoomType" AS ENUM (
    'SINGLE',
    'DOUBLE',
    'SUITE',
    'FAMILY'
);


ALTER TYPE public."RoomType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16784)
-- Name: Booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Booking" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "roomId" integer NOT NULL,
    "checkInDate" timestamp(3) without time zone NOT NULL,
    "checkOutDate" timestamp(3) without time zone NOT NULL,
    "totalDays" integer NOT NULL,
    "totalPrice" double precision NOT NULL,
    status public."BookingStatus" DEFAULT 'PENDING'::public."BookingStatus" NOT NULL,
    "specialRequest" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "appliedCode" text,
    "discountAmount" double precision DEFAULT 0 NOT NULL,
    "paymentMethod" public."PaymentMethod" DEFAULT 'ONLINE'::public."PaymentMethod" NOT NULL,
    "guestCount" integer DEFAULT 1 NOT NULL,
    "guestName" text,
    "guestPhone" text
);


ALTER TABLE public."Booking" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16783)
-- Name: Booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Booking_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Booking_id_seq" OWNER TO postgres;

--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 223
-- Name: Booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Booking_id_seq" OWNED BY public."Booking".id;


--
-- TOC entry 232 (class 1259 OID 25072)
-- Name: Contact; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Contact" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Contact" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 25071)
-- Name: Contact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Contact_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Contact_id_seq" OWNER TO postgres;

--
-- TOC entry 5132 (class 0 OID 0)
-- Dependencies: 231
-- Name: Contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Contact_id_seq" OWNED BY public."Contact".id;


--
-- TOC entry 228 (class 1259 OID 16841)
-- Name: Offer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Offer" (
    id integer NOT NULL,
    title text NOT NULL,
    code text NOT NULL,
    image text NOT NULL,
    color text DEFAULT 'bg-blue-50 text-blue-700 border-blue-200'::text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "discountType" text NOT NULL,
    "discountValue" double precision NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "maxDiscount" double precision,
    "minOrderValue" double precision,
    "startDate" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Offer" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16840)
-- Name: Offer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Offer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Offer_id_seq" OWNER TO postgres;

--
-- TOC entry 5133 (class 0 OID 0)
-- Dependencies: 227
-- Name: Offer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Offer_id_seq" OWNED BY public."Offer".id;


--
-- TOC entry 230 (class 1259 OID 25039)
-- Name: PasswordResetToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PasswordResetToken" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PasswordResetToken" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 25038)
-- Name: PasswordResetToken_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PasswordResetToken_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PasswordResetToken_id_seq" OWNER TO postgres;

--
-- TOC entry 5134 (class 0 OID 0)
-- Dependencies: 229
-- Name: PasswordResetToken_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PasswordResetToken_id_seq" OWNED BY public."PasswordResetToken".id;


--
-- TOC entry 226 (class 1259 OID 16805)
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id integer NOT NULL,
    "bookingId" integer NOT NULL,
    "stripeSessionId" text,
    amount double precision NOT NULL,
    status public."PaymentStatus" DEFAULT 'UNPAID'::public."PaymentStatus" NOT NULL,
    "paymentDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16804)
-- Name: Payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Payment_id_seq" OWNER TO postgres;

--
-- TOC entry 5135 (class 0 OID 0)
-- Dependencies: 225
-- Name: Payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Payment_id_seq" OWNED BY public."Payment".id;


--
-- TOC entry 234 (class 1259 OID 25093)
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id integer NOT NULL,
    rating integer NOT NULL,
    comment text,
    "userId" integer NOT NULL,
    "roomId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 25092)
-- Name: Review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Review_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Review_id_seq" OWNER TO postgres;

--
-- TOC entry 5136 (class 0 OID 0)
-- Dependencies: 233
-- Name: Review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Review_id_seq" OWNED BY public."Review".id;


--
-- TOC entry 222 (class 1259 OID 16764)
-- Name: Room; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Room" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "pricePerNight" double precision NOT NULL,
    capacity integer NOT NULL,
    type public."RoomType" NOT NULL,
    amenities text[],
    images text[],
    "isAvailable" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    location text DEFAULT 'TP. Hồ Chí Minh'::text NOT NULL
);


ALTER TABLE public."Room" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16763)
-- Name: Room_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Room_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Room_id_seq" OWNER TO postgres;

--
-- TOC entry 5137 (class 0 OID 0)
-- Dependencies: 221
-- Name: Room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Room_id_seq" OWNED BY public."Room".id;


--
-- TOC entry 220 (class 1259 OID 16746)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text,
    name text NOT NULL,
    phone text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    avatar text,
    "googleId" text,
    "isLocked" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16745)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 219
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- TOC entry 4914 (class 2604 OID 16787)
-- Name: Booking id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking" ALTER COLUMN id SET DEFAULT nextval('public."Booking_id_seq"'::regclass);


--
-- TOC entry 4928 (class 2604 OID 25075)
-- Name: Contact id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contact" ALTER COLUMN id SET DEFAULT nextval('public."Contact_id_seq"'::regclass);


--
-- TOC entry 4923 (class 2604 OID 16844)
-- Name: Offer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Offer" ALTER COLUMN id SET DEFAULT nextval('public."Offer_id_seq"'::regclass);


--
-- TOC entry 4926 (class 2604 OID 25042)
-- Name: PasswordResetToken id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordResetToken" ALTER COLUMN id SET DEFAULT nextval('public."PasswordResetToken_id_seq"'::regclass);


--
-- TOC entry 4920 (class 2604 OID 16808)
-- Name: Payment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment" ALTER COLUMN id SET DEFAULT nextval('public."Payment_id_seq"'::regclass);


--
-- TOC entry 4931 (class 2604 OID 25096)
-- Name: Review id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review" ALTER COLUMN id SET DEFAULT nextval('public."Review_id_seq"'::regclass);


--
-- TOC entry 4910 (class 2604 OID 16767)
-- Name: Room id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room" ALTER COLUMN id SET DEFAULT nextval('public."Room_id_seq"'::regclass);


--
-- TOC entry 4906 (class 2604 OID 16749)
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 5113 (class 0 OID 16784)
-- Dependencies: 224
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Booking" (id, "userId", "roomId", "checkInDate", "checkOutDate", "totalDays", "totalPrice", status, "specialRequest", "createdAt", "updatedAt", "appliedCode", "discountAmount", "paymentMethod", "guestCount", "guestName", "guestPhone") FROM stdin;
6	2	1	2026-08-20 00:00:00	2026-08-21 00:00:00	1	10000000	CANCELLED		2026-04-10 09:51:26.897	2026-04-11 11:57:08.366	\N	0	ONLINE	1	\N	\N
8	1	1	2026-08-29 00:00:00	2026-08-30 00:00:00	1	10000000	CANCELLED		2026-04-14 10:43:41.787	2026-04-14 10:47:53.199	\N	0	ONLINE	1	\N	\N
1	1	1	2026-04-17 00:00:00	2026-04-25 00:00:00	8	80000000	CANCELLED		2026-04-04 12:54:44.302	2026-04-14 10:51:56.764	\N	0	ONLINE	1	\N	\N
5	2	1	2026-06-12 00:00:00	2026-06-13 00:00:00	1	10000000	COMPLETED		2026-04-10 09:50:04.923	2026-04-14 10:55:22.853	\N	0	ONLINE	1	\N	\N
3	2	1	2026-04-28 00:00:00	2026-05-01 00:00:00	3	30000000	COMPLETED		2026-04-10 09:39:39.121	2026-04-14 11:07:29.334	\N	0	ONLINE	1	\N	\N
9	1	1	2026-07-31 00:00:00	2026-08-01 00:00:00	1	9900001	COMPLETED		2026-04-14 11:00:40.448	2026-04-14 11:17:24.385	SUMMER2026	99999	CASH	1	Anh Minh	0911078382
4	2	1	2026-05-14 00:00:00	2026-05-29 00:00:00	15	150000000	CANCELLED		2026-04-10 09:49:48.538	2026-04-14 11:21:31.933	\N	0	ONLINE	1	\N	\N
2	2	1	2026-04-10 00:00:00	2026-04-11 00:00:00	1	10000000	CANCELLED		2026-04-10 07:14:04.237	2026-04-14 11:27:56.02	\N	0	ONLINE	1	\N	\N
10	1	1	2026-04-14 00:00:00	2026-04-15 00:00:00	1	10000000	CANCELLED		2026-04-14 11:43:04.39	2026-04-14 11:43:23.724	\N	0	CASH	1	Anh Minh	0911078382
13	1	1	2026-04-15 00:00:00	2026-04-16 00:00:00	1	10000000	COMPLETED		2026-04-15 09:34:50.11	2026-04-15 09:35:25.292	\N	0	ONLINE	1	Anh Minh	0911078382
14	1	5	2026-04-14 00:00:00	2026-04-15 00:00:00	1	2200000	PENDING		2026-04-19 09:51:07.369	2026-04-19 09:51:07.369	\N	0	CASH	1	Anh Minh	0911078382
\.


--
-- TOC entry 5121 (class 0 OID 25072)
-- Dependencies: 232
-- Data for Name: Contact; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Contact" (id, name, email, subject, message, "isRead", "createdAt", "updatedAt") FROM stdin;
2	Anh Minh	a@gmail.com	Test	Dịch Vụ Tốt	t	2026-04-14 11:55:18.343	2026-04-14 11:58:47.798
\.


--
-- TOC entry 5117 (class 0 OID 16841)
-- Dependencies: 228
-- Data for Name: Offer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Offer" (id, title, code, image, color, "createdAt", "updatedAt", "discountType", "discountValue", "endDate", "maxDiscount", "minOrderValue", "startDate") FROM stdin;
5	Giảm Giá Mùa Đông	WINTER	https://res.cloudinary.com/dp42o9sek/image/upload/v1776253133/r3jsdkxgkbdf2yj73btp.avif	bg-blue-50 text-blue-700 border-blue-200	2026-04-14 11:32:40.102	2026-04-15 11:38:52.987	FIXED	10000000	2026-05-02 00:00:00	\N	10000000	2026-04-14 00:00:00
4	Giảm Giá Mùa Thu	AUTUMN	https://res.cloudinary.com/dp42o9sek/image/upload/v1776253210/osdvt5rcvflxamqmwwqs.avif	bg-blue-50 text-blue-700 border-blue-200	2026-04-14 11:31:44.131	2026-04-15 11:40:10.646	FIXED	10000000	2026-05-09 00:00:00	\N	10000000	2026-04-14 00:00:00
3	Giảm Giá Mùa Xuân	SPRING	https://res.cloudinary.com/dp42o9sek/image/upload/v1776253361/shkdfvrm0db6houjrm0v.avif	bg-blue-50 text-blue-700 border-blue-200	2026-04-14 11:30:54.495	2026-04-15 11:42:41.238	FIXED	20000000	2026-04-30 00:00:00	\N	10000000	2026-04-14 00:00:00
2	Giảm Giá Mùa Hè	SUMMER2026	https://res.cloudinary.com/dp42o9sek/image/upload/v1776253514/hgd4lobglqf4gxwi1nna.avif	bg-blue-50 text-blue-700 border-blue-200	2026-04-14 08:30:48.115	2026-04-15 11:45:14.054	FIXED	99999	2026-04-30 00:00:00	\N	10000000	2026-04-09 00:00:00
\.


--
-- TOC entry 5119 (class 0 OID 25039)
-- Dependencies: 230
-- Data for Name: PasswordResetToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PasswordResetToken" (id, "userId", token, "expiresAt", "createdAt") FROM stdin;
3	2	dbd209805ff07ff11b763d50d27516fd223f228fd2507b8326ddda00b98a2631	2026-04-14 10:29:10.553	2026-04-14 10:14:10.555
\.


--
-- TOC entry 5115 (class 0 OID 16805)
-- Dependencies: 226
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, "bookingId", "stripeSessionId", amount, status, "paymentDate", "createdAt", "updatedAt") FROM stdin;
1	3	cs_test_a1vPUUePHxBGI7CfYkoRu02Otufic9ZuiNOYVTSaOCHMZdpa79VWonEdX4	30000000	PAID	2026-04-10 09:40:15.957	2026-04-10 09:40:15.959	2026-04-10 09:40:15.959
2	5	cs_test_a1jIUAn5HyBXsBvI5FNBb0GHmMwjcITTdLwFcwu3MMgVeNFKaHlzNPnzYt	10000000	PAID	2026-04-10 09:50:56.779	2026-04-10 09:50:56.78	2026-04-10 09:50:56.78
3	9	\N	9900001	PAID	2026-04-14 11:17:24.372	2026-04-14 11:17:24.373	2026-04-14 11:17:24.373
4	13	cs_test_a1rhsO6mIvSY6segSuj7S0Z5x5nWN8DambMbwpEhUmrUveFWcm2Ksusq4v	10000000	PAID	2026-04-15 09:35:11.428	2026-04-15 09:35:11.43	2026-04-15 09:35:11.43
\.


--
-- TOC entry 5123 (class 0 OID 25093)
-- Dependencies: 234
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, rating, comment, "userId", "roomId", "createdAt", "updatedAt") FROM stdin;
1	5	Phòng xịn	1	1	2026-04-15 11:03:07.371	2026-04-15 11:06:54.338
4	5	Phòng đẹp	1	1	2026-04-15 11:09:48.502	2026-04-15 11:09:48.502
5	5	1	1	1	2026-04-15 11:10:32.013	2026-04-15 11:10:32.013
6	4	ád	1	1	2026-04-15 11:10:35.689	2026-04-15 11:10:35.689
7	2	ád	1	1	2026-04-15 11:10:37.861	2026-04-15 11:10:37.861
8	4	ádas	1	1	2026-04-15 11:10:41.161	2026-04-15 11:10:41.161
9	4	ádasd	1	1	2026-04-15 11:10:44.549	2026-04-15 11:10:44.549
10	4	ádas	1	1	2026-04-15 11:10:47.419	2026-04-15 11:10:47.419
\.


--
-- TOC entry 5111 (class 0 OID 16764)
-- Dependencies: 222
-- Data for Name: Room; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Room" (id, name, description, "pricePerNight", capacity, type, amenities, images, "isAvailable", "createdAt", "updatedAt", location) FROM stdin;
3	Villa Cao Cấp	Trải nghiệm không gian xa hoa với view nhìn toàn cảnh thành phố không ngủ từ trên cao. Căn suite được thiết kế đẳng cấp với nội thất hoàng gia.	3500000	2	SUITE	{"Wifi tốc độ cao","Tivi 4K","Bồn tắm",Minibar,"Phòng khách riêng"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776253801/cqge7ie14j4ljobuarnr.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776253802/su5yobfkqqeo0ixs1jg6.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776253803/egmgxbnpb3cfxhf1wffr.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776253803/ttbnizqxnrsg081suiby.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776253804/kwqzc2b7fbgt1vmaflzf.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:50:05.573	TP. Hồ Chí Minh
5	Family View Biển Mỹ Khê	Phòng rộng rãi, thích hợp cho gia đình có trẻ nhỏ, view biển Mỹ Khê tuyệt đẹp. Đón bình minh ngay trên giường ngủ của bạn.	2200000	4	FAMILY	{"Wifi miễn phí","Ban công view biển","Hồ bơi vô cực","Bếp mini"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776253962/efyzaurfas9da5hoc7ub.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776253963/upeokxz7dex6bq91give.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776253964/pr9joqnb9xobjut4kerx.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776253964/k64do4la13mmmsxif0hl.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776253965/pc6lfgpntrbcpcz953jt.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:52:46.862	Đà Nẵng
6	Villa Cận Biển Trần Phú	Phòng  gia đình cao cấp , thiết kế hiện đại chỉ cách bãi biển Trần Phú vài bước chân. Lý tưởng cho người đi công tác hoặc du lịch ,nghỉ dưỡng cùng gia đình.	800000	11	FAMILY	{"Wifi tốc độ cao","Tivi thông minh","Dọn phòng mỗi ngày"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776254008/djiuchxjbqujwhn8nxai.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254009/hdyjbdbwppcb0jzpjfv5.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254009/n8iwjofaak1t8xo7ddbw.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254011/ydmvw0vms4bh3kbaewzs.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254012/sqyfubus7utm8ah51sbx.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:54:10.445	Nha Trang
7	Suite Nghỉ Dưỡng Bãi Sau	Hưởng thụ dịch vụ đẳng cấp 5 sao tại bãi biển nổi tiếng nhất Vũng Tàu. Phục vụ bữa sáng tận phòng và rượu vang chào mừng.	2800000	2	SUITE	{"Bồn tắm massage","Hồ bơi riêng","Xe đưa đón","Buffet hải sản"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776254070/qncvbpq3al2n9kjhzlro.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254071/gzt63q7rj6rtgv5jfi0y.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254072/ob2qufrmpk3ovbigetjb.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254073/hann4zxodwpuy7qbqttx.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254073/qww6xzlswfzvb5cnyqkb.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:54:34.149	Vũng Tàu
4	Villa Phố Cổ Hà Nội	Không gian ấm cúng, đậm chất văn hóa ngay trung tâm thủ đô. Chỉ vài bước chân là ra đến Hồ Gươm và khu phố đi bộ nhộn nhịp.	1200000	2	DOUBLE	{"Wifi miễn phí","Điều hòa 2 chiều","Ăn sáng buffet"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776254627/mwhk3xtdkfgoatmzqzzv.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254628/yr7fgyjsorpgtozyvbso.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254629/mhtlqyjecrjrxa1sydtd.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254630/cdzwcfggrevvbjnvrysm.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254631/hg2oamy3wcsehrvl3h4d.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 12:03:51.782	Hà Nội
9	Villa Sinh Thái Bắc Đảo	Khu nghỉ dưỡng sinh thái biệt lập mang đến sự bình yên tuyệt đối giữa lòng đảo ngọc Phú Quốc. Phù hợp cho đại gia đình.	4500000	6	FAMILY	{"Wifi miễn phí","Hồ bơi riêng","Sân nướng BBQ","Bãi biển riêng"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776254132/rbui9uviwszrnbjw8sen.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254133/oy3ecv3ofuoibx7upruh.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254134/epz9slqujvrbipq5k9zf.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254134/m7xr3h78gu7yjddjgx7c.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254135/g0um5amo9xb5wl1ckiku.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:55:36.27	Phú Quốc
10	Phòng Cổ Điển Phố Hội	Sự pha trộn hoàn hảo giữa kiến trúc mái ngói âm dương cổ kính và tiện nghi hiện đại của thế kỷ 21.	1800000	2	DOUBLE	{"Thuê xe đạp miễn phí","Hồ bơi trong nhà","Bồn tắm gỗ"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776254156/jj83c94nyro9nidbwdat.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254157/vsmakjrhcm4pmjtwboic.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254158/ctehzurbk7kewzi5htle.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254159/mk0oki3rzvfabu2mbzrl.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254160/vppxosst55vwukntm8ha.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:56:02.037	Hội An
1	Phòng Deluxe Hướng Biển	Tận hưởng kỳ nghỉ tuyệt vời với không gian rộng 40m2, view biển cực chill và đầy đủ tiện nghi cao cấp.	10000000	2	DOUBLE	{"Wifi miễn phí","Bồn tắm","Ban công"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776254365/qkruudvxwvgv7tqzlv7d.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254366/scpcst5qyemoceaocsyw.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254367/endzkyeea9oifopf3vwb.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254367/xg3angahr6u2nsgqm6yb.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254368/pmx9b2quwn7e79oykqnf.jpg}	t	2026-04-04 12:41:50.172	2026-04-15 11:59:29.325	Cần Thơ
11	Cabin Du Thuyền Trên Vịnh	Trải nghiệm ngủ đêm trên du thuyền sang trọng, ngắm nhìn toàn cảnh kỳ quan thiên nhiên thế giới Hạ Long.	3200000	2	SUITE	{"Ban công hướng vịnh","Ăn 3 bữa","Câu mực đêm","Chèo Kayak"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776254317/wtybv9lord0vqkdplw1k.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254318/xfysehacxhz7aqatkxh8.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254319/fb7rvpnvro8booqjsres.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254319/hv2zjdgrvug9bx0n3uav.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254320/loymrvw2vkzrg3t0wv7t.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:58:43.7	Hạ Long
14	Bungalow Đồi Cát Bay	Không gian yên tĩnh lọt thỏm giữa đồi cát và bãi biển xanh mát. Thiết kế Bungalow lợp lá cực kỳ chill.	1600000	2	DOUBLE	{"Hồ bơi riêng","Nhà hàng ven biển","Tour đồi cát"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776254234/aajj5lcqnq926ftqmun8.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254235/yufjanusvphh02geaarg.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254236/klvdvyrqzzf9nex9wpln.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254237/i4jjonux4jmanfa3jc6d.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254238/eqddcz4rgjs8p1l2thoi.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:57:21.658	Phan Thiết
17	Villa Hoàng Gia Huế	Thiết kế lấy cảm hứng từ kiến trúc cung đình. Nội thất gỗ lim nguyên khối và sân vườn rộng lớn chuẩn xứ Huế mộng mơ.	2500000	2	SUITE	{"Thưởng thức nhã nhạc","Phòng trà","Bồn tắm hoa hồng"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776253569/czgmmtjawvjdqqb3aszm.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776253581/pfmcjdikmmr62zjwjqo3.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776253582/iv7tq1lsbf3srsgjjrxg.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776253583/sb21pyb2juq4w2eimg55.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776253592/topwvvc8nayqtueq7rro.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:49:28.317	Huế
8	Phòng Đôi Hồ Tuyền Lâm	Tận hưởng tiết trời se lạnh và sương mù lãng mạn của thành phố ngàn hoa. Có lò sưởi và ban công ngắm rừng thông.	1500000	2	DOUBLE	{"Máy sưởi","Ban công","Trà & Cà phê miễn phí"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776254086/lf1wlaon4bysvcsddgjg.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254087/euwqvocnqusnpuxc1xuq.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254088/keazpzfkfpdoxoj4xcm7.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254089/kopbrlxrwynqt2dotw18.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254089/buun5hnnivgfedevqmbo.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:54:52.844	Đà Lạt
12	Homestay Săn Mây Tả Van	Thiết kế bằng gỗ thông hoàn toàn, view nhìn thẳng xuống thung lũng Mường Hoa và đỉnh Fansipan hùng vĩ.	1400000	2	DOUBLE	{"Máy sưởi ấm","Ban công săn mây","Ngâm chân lá thuốc"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776254185/memr6i9hg58cr8azyalw.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254185/bj5nfwm3bnlvp4xkp8qo.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254186/flntladwl1hzgwb1l2tt.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254187/lxtzsl3wzkwnjrdoku2q.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254188/agxgqtpav4hx3egnj0aq.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:56:28.078	Sa Pa
13	Resort Eo Gió - Kỳ Co	Thiết kế mở, mang hơi thở của biển cả. Chỉ cách Eo Gió - nơi ngắm hoàng hôn đẹp nhất Việt Nam vài trăm mét.	1900000	4	FAMILY	{"Wifi miễn phí","Hồ bơi vô cực","Spa & Massage"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776254211/qneo9kpt3gxlpwht9h9d.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254212/xue1q385rutgvlhjjvbj.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254213/sklahzeaewos1y9axqno.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254213/kqsbpkegdhorciotj9df.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254214/dm2weifc5secou9zr53b.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:56:54.501	Quy Nhơn
15	Suite VIP Bến Ninh Kiều	Tận hưởng chuyến du lịch miền Tây sông nước đích thực. Phòng VIP trang bị ban công ngắm toàn cảnh bến Ninh Kiều.	2500000	2	SUITE	{"Wifi miễn phí","Ăn sáng chợ nổi","Đưa đón tận nơi"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776254268/w86mh6qijco89ipqgany.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254269/h8w7h39ojknuhiokgcnn.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254270/alpdj61f4mjtjhdqmnma.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254270/ngr28uqzzgutzkqqxxy6.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254272/blyrrsdumrxjxfpnr2qy.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:57:52.231	Cần Thơ
16	Phòng Đơn Biển Cát Bà	Chỗ nghỉ lý tưởng và tiết kiệm cho dịp cuối tuần trốn khỏi thành phố ngột ngạt. Nằm sát mặt biển đầy sóng vỗ.	650000	1	SINGLE	{Wifi,"Tủ lạnh mini","Nước nóng lạnh"}	{https://res.cloudinary.com/dp42o9sek/image/upload/v1776254287/jbxo6lm1as234cfmgspe.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254288/hjsalwvy0lvrgnsbyw7a.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254288/poiunktawyjqf0gr6ukr.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254289/kv4xqziqe1touoovbrpz.jpg,https://res.cloudinary.com/dp42o9sek/image/upload/v1776254290/eir6v8jwngzb58l6sjtt.jpg}	t	2026-04-15 16:53:53.171	2026-04-15 11:58:11.229	Hải Phòng
\.


--
-- TOC entry 5109 (class 0 OID 16746)
-- Dependencies: 220
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, name, phone, role, "createdAt", "updatedAt", avatar, "googleId", "isLocked") FROM stdin;
2	minhkendy1902@gmail.com	$2b$10$QbOOYINUxIhlvhBlyqcxUen8Rw18U1JggRAmRXN1kgjtR39rnoj8W	ADMIN	01111111111	ADMIN	2026-04-10 07:13:36.568	2026-04-14 10:18:14.171	https://res.cloudinary.com/dp42o9sek/image/upload/v1775899441/kpew3va0gooj6irpk0si.png	101616247992805419141	f
1	daoconganhminh1902@gmail.com	$2b$10$DtVjdoz/zxRHW2zYeMSN7uE8q2RUVJdubvDkFKsIKlrqeVVUpReaS	Anh Minh	0911078382	USER	2026-04-04 12:37:51.244	2026-04-15 11:31:57.417	https://res.cloudinary.com/dp42o9sek/image/upload/v1775906419/c5elwxop5wtextmhrmlw.png	100715689387117212188	f
\.


--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 223
-- Name: Booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Booking_id_seq"', 14, true);


--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 231
-- Name: Contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Contact_id_seq"', 2, true);


--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 227
-- Name: Offer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Offer_id_seq"', 5, true);


--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 229
-- Name: PasswordResetToken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PasswordResetToken_id_seq"', 3, true);


--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 225
-- Name: Payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Payment_id_seq"', 4, true);


--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 233
-- Name: Review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Review_id_seq"', 10, true);


--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 221
-- Name: Room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Room_id_seq"', 17, true);


--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 219
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 3, true);


--
-- TOC entry 4940 (class 2606 OID 16803)
-- Name: Booking Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- TOC entry 4952 (class 2606 OID 25089)
-- Name: Contact Contact_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_pkey" PRIMARY KEY (id);


--
-- TOC entry 4947 (class 2606 OID 16857)
-- Name: Offer Offer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Offer"
    ADD CONSTRAINT "Offer_pkey" PRIMARY KEY (id);


--
-- TOC entry 4949 (class 2606 OID 25052)
-- Name: PasswordResetToken PasswordResetToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY (id);


--
-- TOC entry 4943 (class 2606 OID 16820)
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- TOC entry 4954 (class 2606 OID 25107)
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- TOC entry 4938 (class 2606 OID 16782)
-- Name: Room Room_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room"
    ADD CONSTRAINT "Room_pkey" PRIMARY KEY (id);


--
-- TOC entry 4936 (class 2606 OID 16762)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4945 (class 1259 OID 16858)
-- Name: Offer_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Offer_code_key" ON public."Offer" USING btree (code);


--
-- TOC entry 4950 (class 1259 OID 25053)
-- Name: PasswordResetToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON public."PasswordResetToken" USING btree (token);


--
-- TOC entry 4941 (class 1259 OID 16822)
-- Name: Payment_bookingId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_bookingId_key" ON public."Payment" USING btree ("bookingId");


--
-- TOC entry 4944 (class 1259 OID 16823)
-- Name: Payment_stripeSessionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_stripeSessionId_key" ON public."Payment" USING btree ("stripeSessionId");


--
-- TOC entry 4933 (class 1259 OID 16821)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 4934 (class 1259 OID 25037)
-- Name: User_googleId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_googleId_key" ON public."User" USING btree ("googleId");


--
-- TOC entry 4955 (class 2606 OID 16829)
-- Name: Booking Booking_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES public."Room"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4956 (class 2606 OID 16824)
-- Name: Booking Booking_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4958 (class 2606 OID 25054)
-- Name: PasswordResetToken PasswordResetToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4957 (class 2606 OID 16834)
-- Name: Payment Payment_bookingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES public."Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4959 (class 2606 OID 25114)
-- Name: Review Review_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES public."Room"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4960 (class 2606 OID 25109)
-- Name: Review Review_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5130 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-04-19 17:59:18

--
-- PostgreSQL database dump complete
--

\unrestrict c3EgefscrMjSdoJvSIbcXdcECkezazNmvwaQL8GO8ec0SttOjEhqBS6dRxbfxpe

