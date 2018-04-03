-- Table: public.source_status

-- DROP TABLE public.source_status;

CREATE TABLE public.source_status
(
    source_id integer NOT NULL DEFAULT nextval('source_status_source_id_seq'::regclass),
    period integer NOT NULL DEFAULT 1440,
    next_fetch integer,
    last_fetch integer,
    updated integer,
    CONSTRAINT source_status_pkey PRIMARY KEY (source_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.source_status
    OWNER to developer;

-- Index: source_status_source_id_uindex

-- DROP INDEX public.source_status_source_id_uindex;

CREATE UNIQUE INDEX source_status_source_id_uindex
    ON public.source_status USING btree
    (source_id)
    TABLESPACE pg_default;
