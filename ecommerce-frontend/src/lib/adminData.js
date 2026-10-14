const CATEGORIES_STORAGE_KEY = "ecommerce_admin_categories";

export const INITIAL_CUSTOMERS = [];
export const INITIAL_REVIEWS = [];

export function paginateItems(items, currentPage, pageSize) {
  const startIndex = (currentPage - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
}

export function getStoredCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((category) => String(category?.name || "").trim().toLowerCase() !== "condiments")
      : [];
  } catch (error) {
    return [];
  }
}

export function saveStoredCategories(categories) {
  const sanitizedCategories = Array.isArray(categories)
    ? categories.filter((category) => String(category?.name || "").trim().toLowerCase() !== "condiments")
    : [];
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(sanitizedCategories));
}

export function getActiveCategoryOptions(categories) {
  return categories
    .filter((category) => category.status !== "Inactive")
    .map((category) => category.name)
    .filter(Boolean);
}
