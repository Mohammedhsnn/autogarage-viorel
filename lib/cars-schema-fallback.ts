/** True when PostgREST reports missing apk_bespreken_bij_bezoek column (migration not applied). */
export function isMissingApkBesprekenColumnError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false
  const e = err as { code?: string; message?: string }
  return (
    e.code === "PGRST204" &&
    typeof e.message === "string" &&
    e.message.includes("apk_bespreken_bij_bezoek")
  )
}
