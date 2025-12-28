/**
 * API Configuration for PDF-App Frontend
 * Centralizes API URL configuration using environment variables
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const API_ENDPOINTS = {
  EXPORT_PDF: `${API_BASE_URL}/api/export-pdf`,
  GENERATE_PREVIEW: `${API_BASE_URL}/api/generate-preview-pdf`,
}

export { API_BASE_URL }
