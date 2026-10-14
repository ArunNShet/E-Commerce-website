
import { apiRequest } from "./http";

export function listCustomers(authToken) {
  return apiRequest("/api/admin/customers", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}
