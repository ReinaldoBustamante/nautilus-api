-- CreateIndex
CREATE INDEX "user_email_deleted_at_idx" ON "user"("email", "deleted_at");
