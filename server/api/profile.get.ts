export default defineEventHandler(async (e) => {
  return e.context.user || null;
});
