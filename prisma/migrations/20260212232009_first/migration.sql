-- CreateEnum
CREATE TYPE "appointment_status_type" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "user_role_type" AS ENUM ('admin', 'patient', 'doctor');

-- CreateEnum
CREATE TYPE "user_status_type" AS ENUM ('active', 'inactive', 'suspended', 'deleted');

-- CreateTable
CREATE TABLE "appointment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "appointment_date" TIMESTAMP(6) NOT NULL,
    "appointment_status" "appointment_status_type" NOT NULL DEFAULT 'pending',
    "address_snapshot" VARCHAR(100) NOT NULL,
    "email_snapshot" VARCHAR(100) NOT NULL,
    "phone_number_snapshot" VARCHAR(100) NOT NULL,
    "comment" TEXT,
    "doctor_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "phone_number" VARCHAR(50) NOT NULL,
    "rut" VARCHAR(20) NOT NULL,
    "specialization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_schedule" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "day_of_week" INTEGER NOT NULL,
    "start_time" VARCHAR(50) NOT NULL,
    "end_time" VARCHAR(50) NOT NULL,
    "doctor_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "is_activated" BOOLEAN DEFAULT true,

    CONSTRAINT "doctor_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "rut" VARCHAR(20) NOT NULL,
    "default_phone_number" VARCHAR(30) NOT NULL,
    "default_address" VARCHAR(100) NOT NULL,
    "user_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialization" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "user_role" "user_role_type" NOT NULL DEFAULT 'patient',
    "user_status" "user_status_type" NOT NULL DEFAULT 'inactive',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_schedule_day_of_week_doctor_id_start_time_key" ON "doctor_schedule"("day_of_week", "doctor_id", "start_time");

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "fk_appointment_doctor" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "fk_appointment_patient" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doctor" ADD CONSTRAINT "fk_doctor_specialization" FOREIGN KEY ("specialization_id") REFERENCES "specialization"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doctor" ADD CONSTRAINT "fk_doctor_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doctor_schedule" ADD CONSTRAINT "fk_doctor_schedule_doctor" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "fk_patient_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;


create unique index unique_user_email on "user" (email)
where
    deleted_at is null;

create unique index unique_patient_rut on patient (rut)
where
    deleted_at is null;

create unique index unique_patient_user_id on patient (user_id)
where
    deleted_at is null;

create unique index unique_specialization_name on specialization (name)
where
    deleted_at is null;

create unique index unique_doctor_user_id on doctor (user_id)
where
    deleted_at is null;

create unique index unique_doctor_rut on doctor (rut)
where
    deleted_at is null;

create unique index unique_active_appointment_per_doctor on appointment (appointment_date, doctor_id)
where
    appointment_status <> 'cancelled'
    and deleted_at is null;