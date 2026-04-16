import SHA256 from "crypto-js/sha256";

/**
 * Generates a SHA256 watermark hash based on user, product, and chapter IDs,
 * with an optional private salt.
 *
 * @param {object} params
 * @param {string} params.userId - The user's unique ID.
 * @param {string} params.productId - The product's unique ID.
 * @param {string} params.chapterId - The chapter's unique ID.
 * @param {string} [params.secret="SNAPGAIN_PRIVATE_SALT_2026"] - A private salt for hashing.
 * @returns {string} The SHA256 hash string.
 */
export function generateWatermark({
  userId,
  productId,
  chapterId,
  secret = "SNAPGAIN_PRIVATE_SALT_2026",
}) {
  const dataToHash = `${userId}:${productId}:${chapterId}:${secret}`;
  return SHA256(dataToHash).toString();
}