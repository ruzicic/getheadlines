-- Table: public.sources

-- DROP TABLE public.sources;

CREATE TABLE public.sources
(
    id integer NOT NULL DEFAULT nextval('sources_id_seq'::regclass),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default",
    slug character varying COLLATE pg_catalog."default" NOT NULL,
    homepage character varying COLLATE pg_catalog."default" NOT NULL,
    url character varying COLLATE pg_catalog."default" NOT NULL,
    image character varying COLLATE pg_catalog."default",
    language character varying COLLATE pg_catalog."default" NOT NULL,
    country character varying COLLATE pg_catalog."default" NOT NULL,
    category character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT sources_id_pk PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.sources
    OWNER to developer;

-- Index: sources_id_uindex

-- DROP INDEX public.sources_id_uindex;

CREATE UNIQUE INDEX sources_id_uindex
    ON public.sources USING btree
    (id)
    TABLESPACE pg_default;

-- Index: sources_url_uindex

-- DROP INDEX public.sources_url_uindex;

CREATE UNIQUE INDEX sources_url_uindex
    ON public.sources USING btree
    (url COLLATE pg_catalog."default")
    TABLESPACE pg_default;
