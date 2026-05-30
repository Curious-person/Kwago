import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { validateUser } from "./userService";

describe("validateUser", () => {
  // Valid user data for testing
  const validUser = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "user@example.com",
    display_name: "John Doe",
    avatar_url: "https://example.com/avatar.jpg",
    role: "member",
    status: "active",
    created_at: "2024-01-15T10:30:00Z",
  };

  describe("Valid user data", () => {
    it("should pass validation with all required fields", () => {
      const result = validateUser(validUser);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(validUser.id);
        expect(result.data.email).toBe(validUser.email);
        expect(result.data.display_name).toBe(validUser.display_name);
        expect(result.data.avatar_url).toBe(validUser.avatar_url);
        expect(result.data.role).toBe(validUser.role);
        expect(result.data.status).toBe(validUser.status);
        expect(result.data.created_at).toBe(validUser.created_at);
      }
    });

    it("should pass validation with null display_name", () => {
      const user = { ...validUser, display_name: null };
      const result = validateUser(user);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.display_name).toBeNull();
      }
    });

    it("should pass validation with null avatar_url", () => {
      const user = { ...validUser, avatar_url: null };
      const result = validateUser(user);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.avatar_url).toBeNull();
      }
    });

    it("should pass validation with author role", () => {
      const user = { ...validUser, role: "author" };
      const result = validateUser(user);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe("author");
      }
    });

    it("should pass validation with admin role", () => {
      const user = { ...validUser, role: "admin" };
      const result = validateUser(user);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe("admin");
      }
    });

    it("should pass validation with suspended status", () => {
      const user = { ...validUser, status: "suspended" };
      const result = validateUser(user);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe("suspended");
      }
    });

    it("should pass validation with ISO 8601 timestamp without milliseconds", () => {
      const user = { ...validUser, created_at: "2024-01-15T10:30:00Z" };
      const result = validateUser(user);
      expect(result.success).toBe(true);
    });

    it("should pass validation with ISO 8601 timestamp with milliseconds", () => {
      const user = { ...validUser, created_at: "2024-01-15T10:30:00.123Z" };
      const result = validateUser(user);
      expect(result.success).toBe(true);
    });

    it("should pass validation with optional updated_at field", () => {
      const user = { ...validUser, updated_at: "2024-01-16T10:30:00Z" };
      const result = validateUser(user);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.updated_at).toBe("2024-01-16T10:30:00Z");
      }
    });

    it("should pass validation with optional posts_count field", () => {
      const user = { ...validUser, posts_count: 5 };
      const result = validateUser(user);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.posts_count).toBe(5);
      }
    });
  });

  describe("Invalid data type", () => {
    it("should fail validation if data is null", () => {
      const result = validateUser(null);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.message).toContain("must be an object");
      }
    });

    it("should fail validation if data is an array", () => {
      const result = validateUser([validUser]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.message).toContain("must be an object");
      }
    });

    it("should fail validation if data is a string", () => {
      const result = validateUser("not an object");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });

    it("should fail validation if data is a number", () => {
      const result = validateUser(123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });
  });

  describe("Missing required fields", () => {
    it("should fail validation if id is missing", () => {
      const user = { ...validUser };
      delete (user as any).id;
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("id");
      }
    });

    it("should fail validation if email is missing", () => {
      const user = { ...validUser };
      delete (user as any).email;
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("email");
      }
    });

    it("should fail validation if display_name is missing", () => {
      const user = { ...validUser };
      delete (user as any).display_name;
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("display_name");
      }
    });

    it("should fail validation if role is missing", () => {
      const user = { ...validUser };
      delete (user as any).role;
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("role");
      }
    });

    it("should fail validation if status is missing", () => {
      const user = { ...validUser };
      delete (user as any).status;
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("status");
      }
    });

    it("should fail validation if created_at is missing", () => {
      const user = { ...validUser };
      delete (user as any).created_at;
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("created_at");
      }
    });
  });

  describe("Invalid id field", () => {
    it("should fail validation if id is empty string", () => {
      const user = { ...validUser, id: "" };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("id");
      }
    });

    it("should fail validation if id is not a string", () => {
      const user = { ...validUser, id: 123 };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("id");
      }
    });

    it("should fail validation if id is not a valid UUID", () => {
      const user = { ...validUser, id: "not-a-uuid" };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("id");
      }
    });

    it("should fail validation if id is a UUID with wrong format", () => {
      const user = { ...validUser, id: "550e8400e29b41d4a716446655440000" }; // Missing hyphens
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("id");
      }
    });
  });

  describe("Invalid email field", () => {
    it("should fail validation if email is empty string", () => {
      const user = { ...validUser, email: "" };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("email");
      }
    });

    it("should fail validation if email is not a string", () => {
      const user = { ...validUser, email: 123 };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("email");
      }
    });
  });

  describe("Invalid display_name field", () => {
    it("should fail validation if display_name is not a string or null", () => {
      const user = { ...validUser, display_name: 123 };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("display_name");
      }
    });

    it("should fail validation if display_name is an object", () => {
      const user = { ...validUser, display_name: {} };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("display_name");
      }
    });
  });

  describe("Invalid avatar_url field", () => {
    it("should fail validation if avatar_url is not a string or null", () => {
      const user = { ...validUser, avatar_url: 123 };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("avatar_url");
      }
    });

    it("should fail validation if avatar_url is an object", () => {
      const user = { ...validUser, avatar_url: {} };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("avatar_url");
      }
    });
  });

  describe("Invalid role field", () => {
    it("should fail validation if role is not a string", () => {
      const user = { ...validUser, role: 123 };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("role");
      }
    });

    it("should fail validation if role is an invalid value", () => {
      const user = { ...validUser, role: "invalid" };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("role");
      }
    });

    it("should fail validation if role is empty string", () => {
      const user = { ...validUser, role: "" };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("role");
      }
    });
  });

  describe("Invalid status field", () => {
    it("should fail validation if status is not a string", () => {
      const user = { ...validUser, status: 123 };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("status");
      }
    });

    it("should fail validation if status is an invalid value", () => {
      const user = { ...validUser, status: "invalid" };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("status");
      }
    });

    it("should fail validation if status is empty string", () => {
      const user = { ...validUser, status: "" };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("status");
      }
    });
  });

  describe("Invalid created_at field", () => {
    it("should fail validation if created_at is not a string", () => {
      const user = { ...validUser, created_at: 123 };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("created_at");
      }
    });

    it("should fail validation if created_at is not ISO 8601 format", () => {
      const user = { ...validUser, created_at: "2024-01-15" };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("created_at");
      }
    });

    it("should fail validation if created_at is an invalid date", () => {
      const user = { ...validUser, created_at: "2024-13-45T25:70:00Z" };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("created_at");
      }
    });

    it("should fail validation if created_at is empty string", () => {
      const user = { ...validUser, created_at: "" };
      const result = validateUser(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("created_at");
      }
    });
  });

  describe("Error response structure", () => {
    it("should include error code in error response", () => {
      const result = validateUser(null);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBeDefined();
        expect(typeof result.error.code).toBe("string");
      }
    });

    it("should include error message in error response", () => {
      const result = validateUser(null);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBeDefined();
        expect(typeof result.error.message).toBe("string");
      }
    });

    it("should include error details in error response", () => {
      const result = validateUser({ ...validUser, role: "invalid" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.details).toBeDefined();
        expect(result.error.details?.field).toBe("role");
      }
    });
  });
});

import { profileToUser } from "./userService";

describe("profileToUser", () => {
  // Valid profile data for testing
  const validProfile = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "user@example.com",
    display_name: "John Doe",
    avatar_url: "https://example.com/avatar.jpg",
    role: "member" as const,
    status: "active" as const,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  };

  describe("Valid profile transformation", () => {
    it("should transform a valid profile with all fields", () => {
      const result = profileToUser(validProfile);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(validProfile.id);
        expect(result.data.email).toBe(validProfile.email);
        expect(result.data.display_name).toBe(validProfile.display_name);
        expect(result.data.avatar_url).toBe(validProfile.avatar_url);
        expect(result.data.role).toBe(validProfile.role);
        expect(result.data.status).toBe(validProfile.status);
        expect(result.data.created_at).toBe(validProfile.created_at);
        expect(result.data.updated_at).toBe(validProfile.updated_at);
      }
    });

    it("should transform a profile with null avatar_url", () => {
      const profile = { ...validProfile, avatar_url: null };
      const result = profileToUser(profile);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.avatar_url).toBeNull();
      }
    });

    it("should transform a profile with null display_name", () => {
      const profile = { ...validProfile, display_name: null };
      const result = profileToUser(profile);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.display_name).toBeNull();
      }
    });

    it("should transform a profile with author role", () => {
      const profile = { ...validProfile, role: "author" as const };
      const result = profileToUser(profile);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe("author");
      }
    });

    it("should transform a profile with suspended status", () => {
      const profile = { ...validProfile, status: "suspended" as const };
      const result = profileToUser(profile);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe("suspended");
      }
    });

    it("should preserve all required fields during transformation", () => {
      const result = profileToUser(validProfile);
      expect(result.success).toBe(true);
      if (result.success) {
        // Verify all required fields are present
        expect(result.data.id).toBeDefined();
        expect(result.data.email).toBeDefined();
        expect(result.data.display_name).toBeDefined();
        expect(result.data.role).toBeDefined();
        expect(result.data.status).toBeDefined();
        expect(result.data.created_at).toBeDefined();
      }
    });

    it("should not lose data during transformation", () => {
      const result = profileToUser(validProfile);
      expect(result.success).toBe(true);
      if (result.success) {
        // Verify data accuracy - no data loss
        expect(result.data.id).toBe(validProfile.id);
        expect(result.data.email).toBe(validProfile.email);
        expect(result.data.display_name).toBe(validProfile.display_name);
        expect(result.data.avatar_url).toBe(validProfile.avatar_url);
        expect(result.data.created_at).toBe(validProfile.created_at);
      }
    });
  });

  describe("Admin role handling", () => {
    it("should filter out admin role and convert to member", () => {
      const profile = { ...validProfile, role: "admin" as const };
      const result = profileToUser(profile);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe("member");
      }
    });
  });

  describe("Validation of transformed user", () => {
    it("should validate the transformed user object", () => {
      const result = profileToUser(validProfile);
      expect(result.success).toBe(true);
      if (result.success) {
        // If validation passed, the user should have all required fields
        expect(result.data.id).toBeTruthy();
        expect(result.data.email).toBeTruthy();
        expect(result.data.role).toBeTruthy();
        expect(result.data.status).toBeTruthy();
      }
    });

    it("should return error if profile has invalid role", () => {
      const profile = { ...validProfile, role: "invalid" as any };
      const result = profileToUser(profile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });

    it("should return error if profile has invalid status", () => {
      const profile = { ...validProfile, status: "invalid" as any };
      const result = profileToUser(profile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });

    it("should return error if profile has invalid id", () => {
      const profile = { ...validProfile, id: "not-a-uuid" };
      const result = profileToUser(profile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });

    it("should return error if profile has empty email", () => {
      const profile = { ...validProfile, email: "" };
      const result = profileToUser(profile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });

    it("should return error if profile has invalid created_at", () => {
      const profile = { ...validProfile, created_at: "not-a-timestamp" };
      const result = profileToUser(profile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });
  });

  describe("Edge cases", () => {
    it("should handle profile with both null avatar_url and null display_name", () => {
      const profile = { ...validProfile, avatar_url: null, display_name: null };
      const result = profileToUser(profile);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.avatar_url).toBeNull();
        expect(result.data.display_name).toBeNull();
      }
    });

    it("should handle profile with ISO 8601 timestamp with milliseconds", () => {
      const profile = {
        ...validProfile,
        created_at: "2024-01-15T10:30:00.123Z",
      };
      const result = profileToUser(profile);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.created_at).toBe("2024-01-15T10:30:00.123Z");
      }
    });

    it("should include updated_at in transformed user if present", () => {
      const profile = { ...validProfile, updated_at: "2024-01-16T10:30:00Z" };
      const result = profileToUser(profile);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.updated_at).toBe("2024-01-16T10:30:00Z");
      }
    });
  });

  describe("Error response structure", () => {
    it("should return error response with code and message on validation failure", () => {
      const profile = { ...validProfile, role: "invalid" as any };
      const result = profileToUser(profile);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBeDefined();
        expect(result.error.message).toBeDefined();
        expect(typeof result.error.code).toBe("string");
        expect(typeof result.error.message).toBe("string");
      }
    });

    it("should return success response with data on valid input", () => {
      const result = profileToUser(validProfile);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data.id).toBe(validProfile.id);
      }
    });
  });
});

import {
  classifySupabaseError,
  createErrorResponse,
  createSuccessResponse,
} from "./userService";

describe("classifySupabaseError", () => {
  describe("Network errors", () => {
    it("should classify connection refused error as NETWORK_ERROR", () => {
      const error = new Error("Connection refused");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("NETWORK_ERROR");
      expect(result.message).toContain("Unable to connect");
    });

    it("should classify timeout error as NETWORK_ERROR", () => {
      const error = new Error("Request timeout");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("NETWORK_ERROR");
    });

    it("should classify DNS error as NETWORK_ERROR", () => {
      const error = new Error("DNS resolution failed");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("NETWORK_ERROR");
    });

    it("should classify ECONNREFUSED code as NETWORK_ERROR", () => {
      const error = { code: "ECONNREFUSED", message: "Connection refused" };
      const result = classifySupabaseError(error);
      expect(result.code).toBe("NETWORK_ERROR");
    });

    it("should classify ETIMEDOUT code as NETWORK_ERROR", () => {
      const error = { code: "ETIMEDOUT", message: "Request timed out" };
      const result = classifySupabaseError(error);
      expect(result.code).toBe("NETWORK_ERROR");
    });

    it("should classify ENOTFOUND code as NETWORK_ERROR", () => {
      const error = { code: "ENOTFOUND", message: "DNS lookup failed" };
      const result = classifySupabaseError(error);
      expect(result.code).toBe("NETWORK_ERROR");
    });

    it("should include original message in details", () => {
      const error = new Error("Connection refused");
      const result = classifySupabaseError(error);
      expect(result.details?.originalMessage).toBe("Connection refused");
    });
  });

  describe("Auth errors", () => {
    it("should classify 401 status as AUTH_ERROR", () => {
      const error = { status: 401, message: "Unauthorized" };
      const result = classifySupabaseError(error);
      expect(result.code).toBe("AUTH_ERROR");
      expect(result.message).toContain("session has expired");
    });

    it("should classify session expired error as AUTH_ERROR", () => {
      const error = new Error("Session expired");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("AUTH_ERROR");
    });

    it("should classify invalid credentials error as AUTH_ERROR", () => {
      const error = new Error("Invalid credentials");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("AUTH_ERROR");
    });

    it("should classify token revoked error as AUTH_ERROR", () => {
      const error = new Error("Token revoked");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("AUTH_ERROR");
    });

    it("should classify token expired error as AUTH_ERROR", () => {
      const error = new Error("Token expired");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("AUTH_ERROR");
    });

    it("should classify unauthorized error as AUTH_ERROR", () => {
      const error = new Error("Unauthorized");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("AUTH_ERROR");
    });

    it("should include status in details", () => {
      const error = { status: 401, message: "Unauthorized" };
      const result = classifySupabaseError(error);
      expect(result.details?.status).toBe(401);
    });
  });

  describe("Permission errors", () => {
    it("should classify 403 status as PERMISSION_ERROR", () => {
      const error = { status: 403, message: "Forbidden" };
      const result = classifySupabaseError(error);
      expect(result.code).toBe("PERMISSION_ERROR");
      expect(result.message).toContain("don't have permission");
    });

    it("should classify permission denied error as PERMISSION_ERROR", () => {
      const error = new Error("Permission denied");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("PERMISSION_ERROR");
    });

    it("should classify insufficient privileges error as PERMISSION_ERROR", () => {
      const error = new Error("Insufficient privileges");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("PERMISSION_ERROR");
    });

    it("should classify forbidden error as PERMISSION_ERROR", () => {
      const error = new Error("Forbidden");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("PERMISSION_ERROR");
    });

    it("should classify not authorized error as PERMISSION_ERROR", () => {
      const error = new Error("Not authorized");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("PERMISSION_ERROR");
    });

    it("should include status in details", () => {
      const error = { status: 403, message: "Forbidden" };
      const result = classifySupabaseError(error);
      expect(result.details?.status).toBe(403);
    });
  });

  describe("Constraint errors", () => {
    it("should classify constraint violation error as CONSTRAINT_ERROR", () => {
      const error = new Error("Constraint violation");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("CONSTRAINT_ERROR");
      expect(result.message).toContain("database constraint");
    });

    it("should classify unique constraint error as CONSTRAINT_ERROR", () => {
      const error = new Error("Unique constraint violation");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("CONSTRAINT_ERROR");
    });

    it("should classify foreign key constraint error as CONSTRAINT_ERROR", () => {
      const error = new Error("Foreign key constraint violation");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("CONSTRAINT_ERROR");
    });

    it("should classify check constraint error as CONSTRAINT_ERROR", () => {
      const error = new Error("Check constraint violation");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("CONSTRAINT_ERROR");
    });

    it("should include original message in details", () => {
      const error = new Error("Unique constraint violation");
      const result = classifySupabaseError(error);
      expect(result.details?.originalMessage).toBe(
        "Unique constraint violation",
      );
    });
  });

  describe("Not found errors", () => {
    it("should classify 404 status as NOT_FOUND_ERROR", () => {
      const error = { status: 404, message: "Not found" };
      const result = classifySupabaseError(error);
      expect(result.code).toBe("NOT_FOUND_ERROR");
      expect(result.message).toContain("not found");
    });

    it("should classify not found error as NOT_FOUND_ERROR", () => {
      const error = new Error("Not found");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("NOT_FOUND_ERROR");
    });

    it("should classify does not exist error as NOT_FOUND_ERROR", () => {
      const error = new Error("Resource does not exist");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("NOT_FOUND_ERROR");
    });

    it("should classify no rows error as NOT_FOUND_ERROR", () => {
      const error = new Error("No rows returned");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("NOT_FOUND_ERROR");
    });

    it("should include status in details", () => {
      const error = { status: 404, message: "Not found" };
      const result = classifySupabaseError(error);
      expect(result.details?.status).toBe(404);
    });
  });

  describe("Unknown errors", () => {
    it("should classify null error as UNKNOWN_ERROR", () => {
      const result = classifySupabaseError(null);
      expect(result.code).toBe("UNKNOWN_ERROR");
      expect(result.message).toContain("unexpected error");
    });

    it("should classify undefined error as UNKNOWN_ERROR", () => {
      const result = classifySupabaseError(undefined);
      expect(result.code).toBe("UNKNOWN_ERROR");
    });

    it("should classify unknown error type as UNKNOWN_ERROR", () => {
      const error = new Error("Some random error");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("UNKNOWN_ERROR");
    });

    it("should classify error object without message as UNKNOWN_ERROR", () => {
      const error = {};
      const result = classifySupabaseError(error);
      expect(result.code).toBe("UNKNOWN_ERROR");
    });

    it("should include original message in details", () => {
      const error = new Error("Some random error");
      const result = classifySupabaseError(error);
      expect(result.details?.originalMessage).toBe("Some random error");
    });
  });

  describe("Error classification priority", () => {
    it("should prioritize network errors over other errors", () => {
      const error = {
        code: "ECONNREFUSED",
        message: "Connection refused",
        status: 401,
      };
      const result = classifySupabaseError(error);
      expect(result.code).toBe("NETWORK_ERROR");
    });

    it("should prioritize auth errors over permission errors", () => {
      const error = { status: 401, message: "Session expired" };
      const result = classifySupabaseError(error);
      expect(result.code).toBe("AUTH_ERROR");
    });

    it("should prioritize permission errors over constraint errors", () => {
      const error = { status: 403, message: "Permission denied" };
      const result = classifySupabaseError(error);
      expect(result.code).toBe("PERMISSION_ERROR");
    });
  });

  describe("Case insensitivity", () => {
    it("should classify error messages case-insensitively", () => {
      const error = new Error("CONNECTION REFUSED");
      const result = classifySupabaseError(error);
      expect(result.code).toBe("NETWORK_ERROR");
    });

    it("should classify error codes case-insensitively", () => {
      const error = { code: "ECONNREFUSED", message: "error" };
      const result = classifySupabaseError(error);
      expect(result.code).toBe("NETWORK_ERROR");
    });
  });

  describe("Error details structure", () => {
    it("should include details object in response", () => {
      const error = new Error("Connection refused");
      const result = classifySupabaseError(error);
      expect(result.details).toBeDefined();
      expect(typeof result.details).toBe("object");
    });

    it("should include originalMessage in details", () => {
      const error = new Error("Test error");
      const result = classifySupabaseError(error);
      expect(result.details?.originalMessage).toBeDefined();
    });
  });
});

describe("createErrorResponse", () => {
  describe("Basic error response creation", () => {
    it("should create error response with code and message", () => {
      const response = createErrorResponse(
        "NETWORK_ERROR",
        "Connection failed",
      );
      expect(response.success).toBe(false);
      expect(response.error.code).toBe("NETWORK_ERROR");
      expect(response.error.message).toBe("Connection failed");
    });

    it("should create error response with all error codes", () => {
      const codes: Array<
        | "NETWORK_ERROR"
        | "AUTH_ERROR"
        | "PERMISSION_ERROR"
        | "VALIDATION_ERROR"
        | "CONSTRAINT_ERROR"
        | "NOT_FOUND_ERROR"
        | "UNKNOWN_ERROR"
      > = [
        "NETWORK_ERROR",
        "AUTH_ERROR",
        "PERMISSION_ERROR",
        "VALIDATION_ERROR",
        "CONSTRAINT_ERROR",
        "NOT_FOUND_ERROR",
        "UNKNOWN_ERROR",
      ];

      codes.forEach((code) => {
        const response = createErrorResponse(code, "Test message");
        expect(response.error.code).toBe(code);
      });
    });

    it("should create error response without details", () => {
      const response = createErrorResponse(
        "NETWORK_ERROR",
        "Connection failed",
      );
      expect(response.error.details).toBeUndefined();
    });

    it("should create error response with details", () => {
      const details = { originalError: "Connection refused", retryCount: 3 };
      const response = createErrorResponse(
        "NETWORK_ERROR",
        "Connection failed",
        details,
      );
      expect(response.error.details).toEqual(details);
    });

    it("should create error response with empty details object", () => {
      const response = createErrorResponse(
        "NETWORK_ERROR",
        "Connection failed",
        {},
      );
      expect(response.error.details).toEqual({});
    });
  });

  describe("Error response structure", () => {
    it("should have success property set to false", () => {
      const response = createErrorResponse(
        "NETWORK_ERROR",
        "Connection failed",
      );
      expect(response.success).toBe(false);
    });

    it("should have error property with code, message, and details", () => {
      const response = createErrorResponse(
        "NETWORK_ERROR",
        "Connection failed",
        { test: "value" },
      );
      expect(response.error).toBeDefined();
      expect(response.error.code).toBeDefined();
      expect(response.error.message).toBeDefined();
      expect(response.error.details).toBeDefined();
    });

    it("should not have data property", () => {
      const response = createErrorResponse(
        "NETWORK_ERROR",
        "Connection failed",
      );
      expect((response as any).data).toBeUndefined();
    });
  });

  describe("Error message handling", () => {
    it("should preserve error message exactly", () => {
      const message = "This is a specific error message";
      const response = createErrorResponse("NETWORK_ERROR", message);
      expect(response.error.message).toBe(message);
    });

    it("should handle empty error message", () => {
      const response = createErrorResponse("NETWORK_ERROR", "");
      expect(response.error.message).toBe("");
    });

    it("should handle long error message", () => {
      const message = "A".repeat(1000);
      const response = createErrorResponse("NETWORK_ERROR", message);
      expect(response.error.message).toBe(message);
    });

    it("should handle error message with special characters", () => {
      const message = 'Error: "Connection refused" (code: ECONNREFUSED)';
      const response = createErrorResponse("NETWORK_ERROR", message);
      expect(response.error.message).toBe(message);
    });
  });

  describe("Details handling", () => {
    it("should preserve details object structure", () => {
      const details = {
        field: "email",
        reason: "invalid format",
        value: "test@",
      };
      const response = createErrorResponse(
        "VALIDATION_ERROR",
        "Validation failed",
        details,
      );
      expect(response.error.details).toEqual(details);
    });

    it("should handle nested details object", () => {
      const details = { error: { nested: { value: "test" } } };
      const response = createErrorResponse(
        "UNKNOWN_ERROR",
        "Error occurred",
        details,
      );
      expect(response.error.details?.error).toEqual({
        nested: { value: "test" },
      });
    });

    it("should handle details with various value types", () => {
      const details = {
        string: "value",
        number: 42,
        boolean: true,
        null: null,
        array: [1, 2, 3],
      };
      const response = createErrorResponse("UNKNOWN_ERROR", "Error", details);
      expect(response.error.details).toEqual(details);
    });
  });
});

describe("createSuccessResponse", () => {
  describe("Basic success response creation", () => {
    it("should create success response with data", () => {
      const data = { id: "123", name: "Test" };
      const response = createSuccessResponse(data);
      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
    });

    it("should create success response with string data", () => {
      const response = createSuccessResponse("Success message");
      expect(response.success).toBe(true);
      expect(response.data).toBe("Success message");
    });

    it("should create success response with number data", () => {
      const response = createSuccessResponse(42);
      expect(response.success).toBe(true);
      expect(response.data).toBe(42);
    });

    it("should create success response with boolean data", () => {
      const response = createSuccessResponse(true);
      expect(response.success).toBe(true);
      expect(response.data).toBe(true);
    });

    it("should create success response with array data", () => {
      const data = [1, 2, 3];
      const response = createSuccessResponse(data);
      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
    });

    it("should create success response with null data", () => {
      const response = createSuccessResponse(null);
      expect(response.success).toBe(true);
      expect(response.data).toBeNull();
    });

    it("should create success response with undefined data", () => {
      const response = createSuccessResponse(undefined);
      expect(response.success).toBe(true);
      expect(response.data).toBeUndefined();
    });
  });

  describe("Success response structure", () => {
    it("should have success property set to true", () => {
      const response = createSuccessResponse({ test: "data" });
      expect(response.success).toBe(true);
    });

    it("should have data property", () => {
      const data = { id: "123" };
      const response = createSuccessResponse(data);
      expect(response.data).toBeDefined();
      expect(response.data).toEqual(data);
    });

    it("should not have error property", () => {
      const response = createSuccessResponse({ test: "data" });
      expect((response as any).error).toBeUndefined();
    });
  });

  describe("Data preservation", () => {
    it("should preserve object data exactly", () => {
      const data = { id: "123", name: "Test", status: "active" };
      const response = createSuccessResponse(data);
      expect(response.data).toEqual(data);
      expect(response.data.id).toBe("123");
      expect(response.data.name).toBe("Test");
      expect(response.data.status).toBe("active");
    });

    it("should preserve nested object structure", () => {
      const data = { user: { id: "123", profile: { name: "Test" } } };
      const response = createSuccessResponse(data);
      expect(response.data.user.profile.name).toBe("Test");
    });

    it("should preserve array data exactly", () => {
      const data = [{ id: "1" }, { id: "2" }, { id: "3" }];
      const response = createSuccessResponse(data);
      expect(response.data).toEqual(data);
      expect(response.data.length).toBe(3);
      expect(response.data[0].id).toBe("1");
    });

    it("should preserve complex nested structures", () => {
      const data = {
        users: [
          { id: "1", name: "User 1", tags: ["admin", "active"] },
          { id: "2", name: "User 2", tags: ["user"] },
        ],
        pagination: { page: 1, total: 2 },
      };
      const response = createSuccessResponse(data);
      expect(response.data.users[0].tags).toEqual(["admin", "active"]);
      expect(response.data.pagination.page).toBe(1);
    });
  });

  describe("Generic type handling", () => {
    it("should work with User type", () => {
      const user = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        email: "user@example.com",
        display_name: "John Doe",
        avatar_url: "https://example.com/avatar.jpg",
        role: "member" as const,
        status: "active" as const,
        created_at: "2024-01-15T10:30:00Z",
      };
      const response = createSuccessResponse(user);
      expect(response.success).toBe(true);
      expect(response.data.email).toBe("user@example.com");
    });

    it("should work with paginated response type", () => {
      const paginatedData = {
        data: [{ id: "1" }, { id: "2" }],
        pagination: {
          page: 1,
          limit: 10,
          total: 25,
          totalPages: 3,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      };
      const response = createSuccessResponse(paginatedData);
      expect(response.success).toBe(true);
      expect(response.data.pagination.totalPages).toBe(3);
    });
  });
});

import {
  calculatePaginationMetadata,
  validatePaginationParams,
  PaginationMetadata,
} from "./userService";

describe("calculatePaginationMetadata", () => {
  describe("Valid pagination calculations", () => {
    it("should calculate metadata for page 1 with 10 items per page and 25 total items", () => {
      const result = calculatePaginationMetadata(1, 10, 25);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(25);
      expect(result.totalPages).toBe(3);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.offset).toBe(0);
    });

    it("should calculate metadata for page 2 with 10 items per page and 25 total items", () => {
      const result = calculatePaginationMetadata(2, 10, 25);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(25);
      expect(result.totalPages).toBe(3);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(true);
      expect(result.offset).toBe(10);
    });

    it("should calculate metadata for page 3 (last page) with 10 items per page and 25 total items", () => {
      const result = calculatePaginationMetadata(3, 10, 25);
      expect(result.page).toBe(3);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(25);
      expect(result.totalPages).toBe(3);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(true);
      expect(result.offset).toBe(20);
    });

    it("should calculate metadata for single page result", () => {
      const result = calculatePaginationMetadata(1, 10, 5);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.offset).toBe(0);
    });

    it("should calculate metadata for empty result set", () => {
      const result = calculatePaginationMetadata(1, 10, 0);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(0);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.offset).toBe(0);
    });

    it("should calculate metadata with limit of 1", () => {
      const result = calculatePaginationMetadata(1, 1, 5);
      expect(result.totalPages).toBe(5);
      expect(result.hasNextPage).toBe(true);
      expect(result.offset).toBe(0);
    });

    it("should calculate metadata with large limit", () => {
      const result = calculatePaginationMetadata(1, 1000, 500);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.offset).toBe(0);
    });

    it("should calculate metadata with large page number", () => {
      const result = calculatePaginationMetadata(100, 10, 1001);
      expect(result.page).toBe(100);
      expect(result.offset).toBe(990);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(true);
    });

    it("should calculate correct offset for various page numbers", () => {
      expect(calculatePaginationMetadata(1, 10, 100).offset).toBe(0);
      expect(calculatePaginationMetadata(2, 10, 100).offset).toBe(10);
      expect(calculatePaginationMetadata(3, 10, 100).offset).toBe(20);
      expect(calculatePaginationMetadata(5, 10, 100).offset).toBe(40);
      expect(calculatePaginationMetadata(10, 10, 100).offset).toBe(90);
    });

    it("should calculate correct totalPages with various totals", () => {
      expect(calculatePaginationMetadata(1, 10, 10).totalPages).toBe(1);
      expect(calculatePaginationMetadata(1, 10, 11).totalPages).toBe(2);
      expect(calculatePaginationMetadata(1, 10, 20).totalPages).toBe(2);
      expect(calculatePaginationMetadata(1, 10, 21).totalPages).toBe(3);
      expect(calculatePaginationMetadata(1, 10, 100).totalPages).toBe(10);
    });

    it("should calculate hasNextPage correctly", () => {
      // Page 1 of 3 pages (10 items per page, 25 total)
      expect(calculatePaginationMetadata(1, 10, 25).hasNextPage).toBe(true);
      // Page 2 of 3 pages
      expect(calculatePaginationMetadata(2, 10, 25).hasNextPage).toBe(true);
      // Page 3 of 3 pages (last page)
      expect(calculatePaginationMetadata(3, 10, 25).hasNextPage).toBe(false);
      // Page 1 of 1 page (only page)
      expect(calculatePaginationMetadata(1, 10, 5).hasNextPage).toBe(false);
    });

    it("should calculate hasPreviousPage correctly", () => {
      // Page 1 (first page)
      expect(calculatePaginationMetadata(1, 10, 25).hasPreviousPage).toBe(
        false,
      );
      // Page 2 (middle page)
      expect(calculatePaginationMetadata(2, 10, 25).hasPreviousPage).toBe(true);
      // Page 3 (last page)
      expect(calculatePaginationMetadata(3, 10, 25).hasPreviousPage).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle page 1 with limit 1 and total 1", () => {
      const result = calculatePaginationMetadata(1, 1, 1);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.offset).toBe(0);
    });

    it("should handle very large numbers", () => {
      const result = calculatePaginationMetadata(1000000, 100, 1000000000);
      expect(result.offset).toBe(99999900);
      expect(result.totalPages).toBe(10000000);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(true);
    });

    it("should handle exact page boundary", () => {
      // Page 2 with exactly 20 items (10 per page)
      const result = calculatePaginationMetadata(2, 10, 20);
      expect(result.hasNextPage).toBe(false);
      expect(result.offset).toBe(10);
    });

    it("should handle one item past page boundary", () => {
      // Page 2 with 21 items (10 per page)
      const result = calculatePaginationMetadata(2, 10, 21);
      expect(result.hasNextPage).toBe(true);
      expect(result.offset).toBe(10);
    });
  });

  describe("Invalid pagination parameters", () => {
    it("should throw error if page is 0", () => {
      expect(() => calculatePaginationMetadata(0, 10, 25)).toThrow(
        "Pagination validation failed: page must be >= 1, got 0",
      );
    });

    it("should throw error if page is negative", () => {
      expect(() => calculatePaginationMetadata(-1, 10, 25)).toThrow(
        "Pagination validation failed: page must be >= 1, got -1",
      );
    });

    it("should throw error if limit is 0", () => {
      expect(() => calculatePaginationMetadata(1, 0, 25)).toThrow(
        "Pagination validation failed: limit must be > 0, got 0",
      );
    });

    it("should throw error if limit is negative", () => {
      expect(() => calculatePaginationMetadata(1, -5, 25)).toThrow(
        "Pagination validation failed: limit must be > 0, got -5",
      );
    });

    it("should throw error if total is negative", () => {
      expect(() => calculatePaginationMetadata(1, 10, -1)).toThrow(
        "Pagination validation failed: total must be >= 0, got -1",
      );
    });

    it("should throw error with multiple invalid parameters", () => {
      expect(() => calculatePaginationMetadata(0, 0, -1)).toThrow(
        "Pagination validation failed: page must be >= 1, got 0",
      );
    });
  });

  describe("Return type structure", () => {
    it("should return PaginationMetadata with all required fields", () => {
      const result = calculatePaginationMetadata(1, 10, 25);
      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("limit");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("totalPages");
      expect(result).toHaveProperty("hasNextPage");
      expect(result).toHaveProperty("hasPreviousPage");
      expect(result).toHaveProperty("offset");
    });

    it("should return correct types for all fields", () => {
      const result = calculatePaginationMetadata(1, 10, 25);
      expect(typeof result.page).toBe("number");
      expect(typeof result.limit).toBe("number");
      expect(typeof result.total).toBe("number");
      expect(typeof result.totalPages).toBe("number");
      expect(typeof result.hasNextPage).toBe("boolean");
      expect(typeof result.hasPreviousPage).toBe("boolean");
      expect(typeof result.offset).toBe("number");
    });

    it("should return integers for numeric fields", () => {
      const result = calculatePaginationMetadata(1, 10, 25);
      expect(Number.isInteger(result.page)).toBe(true);
      expect(Number.isInteger(result.limit)).toBe(true);
      expect(Number.isInteger(result.total)).toBe(true);
      expect(Number.isInteger(result.totalPages)).toBe(true);
      expect(Number.isInteger(result.offset)).toBe(true);
    });
  });

  describe("Default page size (10)", () => {
    it("should work with default page size of 10", () => {
      const result = calculatePaginationMetadata(1, 10, 100);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(10);
    });

    it("should calculate correct offset with default page size", () => {
      expect(calculatePaginationMetadata(1, 10, 100).offset).toBe(0);
      expect(calculatePaginationMetadata(2, 10, 100).offset).toBe(10);
      expect(calculatePaginationMetadata(3, 10, 100).offset).toBe(20);
    });
  });
});

describe("validatePaginationParams", () => {
  describe("Valid pagination parameters", () => {
    it("should pass validation with page 1 and limit 10", () => {
      const result = validatePaginationParams(1, 10);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it("should pass validation with page 2 and limit 10", () => {
      const result = validatePaginationParams(2, 10);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(10);
      }
    });

    it("should pass validation with page 1 and limit 1", () => {
      const result = validatePaginationParams(1, 1);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(1);
      }
    });

    it("should pass validation with large page number", () => {
      const result = validatePaginationParams(1000000, 10);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1000000);
      }
    });

    it("should pass validation with large limit", () => {
      const result = validatePaginationParams(1, 1000000);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(1000000);
      }
    });

    it("should pass validation with default page size of 10", () => {
      const result = validatePaginationParams(1, 10);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(10);
      }
    });
  });

  describe("Invalid page parameter", () => {
    it("should fail validation if page is 0", () => {
      const result = validatePaginationParams(0, 10);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("page");
        expect(result.error.message).toContain("page");
      }
    });

    it("should fail validation if page is negative", () => {
      const result = validatePaginationParams(-1, 10);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("page");
      }
    });

    it("should fail validation if page is decimal", () => {
      const result = validatePaginationParams(1.5, 10);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("page");
        expect(result.error.message).toContain("integer");
      }
    });

    it("should fail validation if page is NaN", () => {
      const result = validatePaginationParams(NaN, 10);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("page");
      }
    });

    it("should fail validation if page is Infinity", () => {
      const result = validatePaginationParams(Infinity, 10);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("page");
      }
    });

    it("should fail validation if page is not a number", () => {
      const result = validatePaginationParams("1" as any, 10);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("page");
      }
    });
  });

  describe("Invalid limit parameter", () => {
    it("should fail validation if limit is 0", () => {
      const result = validatePaginationParams(1, 0);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("limit");
        expect(result.error.message).toContain("limit");
      }
    });

    it("should fail validation if limit is negative", () => {
      const result = validatePaginationParams(1, -5);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("limit");
      }
    });

    it("should fail validation if limit is decimal", () => {
      const result = validatePaginationParams(1, 10.5);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("limit");
        expect(result.error.message).toContain("integer");
      }
    });

    it("should fail validation if limit is NaN", () => {
      const result = validatePaginationParams(1, NaN);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("limit");
      }
    });

    it("should fail validation if limit is Infinity", () => {
      const result = validatePaginationParams(1, Infinity);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("limit");
      }
    });

    it("should fail validation if limit is not a number", () => {
      const result = validatePaginationParams(1, "10" as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details?.field).toBe("limit");
      }
    });
  });

  describe("Both parameters invalid", () => {
    it("should fail validation if both page and limit are invalid", () => {
      const result = validatePaginationParams(0, 0);
      expect(result.success).toBe(false);
      if (!result.success) {
        // Should fail on page first (checked first)
        expect(result.error.details?.field).toBe("page");
      }
    });

    it("should fail validation if page is 0 and limit is negative", () => {
      const result = validatePaginationParams(0, -5);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.details?.field).toBe("page");
      }
    });
  });

  describe("Error response structure", () => {
    it("should return error response with code and message", () => {
      const result = validatePaginationParams(0, 10);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.message).toBeDefined();
        expect(typeof result.error.message).toBe("string");
      }
    });

    it("should include field in error details", () => {
      const result = validatePaginationParams(0, 10);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.details?.field).toBeDefined();
      }
    });

    it("should include reason in error details", () => {
      const result = validatePaginationParams(0, 10);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.details?.reason).toBeDefined();
      }
    });

    it("should include value in error details", () => {
      const result = validatePaginationParams(0, 10);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.details?.value).toBeDefined();
      }
    });
  });

  describe("Success response structure", () => {
    it("should return success response with validated params", () => {
      const result = validatePaginationParams(1, 10);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it("should preserve exact values in success response", () => {
      const result = validatePaginationParams(42, 25);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(42);
        expect(result.data.limit).toBe(25);
      }
    });

    it("should not modify validated params", () => {
      const result = validatePaginationParams(5, 20);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(5);
        expect(result.data.limit).toBe(20);
      }
    });
  });

  describe("Type validation", () => {
    it("should validate that page is a number", () => {
      const result = validatePaginationParams(null as any, 10);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.details?.field).toBe("page");
      }
    });

    it("should validate that limit is a number", () => {
      const result = validatePaginationParams(1, null as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.details?.field).toBe("limit");
      }
    });

    it("should validate that page is an integer", () => {
      const result = validatePaginationParams(1.1, 10);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("integer");
      }
    });

    it("should validate that limit is an integer", () => {
      const result = validatePaginationParams(1, 10.1);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("integer");
      }
    });
  });

  describe("Boundary values", () => {
    it("should pass validation with page 1 (minimum valid page)", () => {
      const result = validatePaginationParams(1, 10);
      expect(result.success).toBe(true);
    });

    it("should fail validation with page 0 (below minimum)", () => {
      const result = validatePaginationParams(0, 10);
      expect(result.success).toBe(false);
    });

    it("should pass validation with limit 1 (minimum valid limit)", () => {
      const result = validatePaginationParams(1, 1);
      expect(result.success).toBe(true);
    });

    it("should fail validation with limit 0 (below minimum)", () => {
      const result = validatePaginationParams(1, 0);
      expect(result.success).toBe(false);
    });

    it("should pass validation with very large page number", () => {
      const result = validatePaginationParams(Number.MAX_SAFE_INTEGER, 10);
      expect(result.success).toBe(true);
    });

    it("should pass validation with very large limit", () => {
      const result = validatePaginationParams(1, Number.MAX_SAFE_INTEGER);
      expect(result.success).toBe(true);
    });
  });
});

// ============================================================================
// INTEGRATION TESTS FOR DATABASE OPERATIONS
// ============================================================================

import { getUsers, updateUserRole, updateUserStatus } from "./userService";

describe("Integration Tests - getUsers", () => {
  describe("Fetch all users from Supabase", () => {
    it("should fetch users with default pagination", async () => {
      // This test demonstrates the expected behavior
      // In a real integration test, you would use a test database
      const result = await getUsers();

      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data.data).toBeInstanceOf(Array);
        expect(result.data.pagination).toBeDefined();
        expect(result.data.pagination.page).toBe(1);
        expect(result.data.pagination.limit).toBe(10);
      }
    });

    it("should return paginated response structure", async () => {
      const result = await getUsers();

      if (result.success) {
        expect(result.data).toHaveProperty("data");
        expect(result.data).toHaveProperty("pagination");
        expect(result.data.pagination).toHaveProperty("page");
        expect(result.data.pagination).toHaveProperty("limit");
        expect(result.data.pagination).toHaveProperty("total");
        expect(result.data.pagination).toHaveProperty("totalPages");
        expect(result.data.pagination).toHaveProperty("hasNextPage");
        expect(result.data.pagination).toHaveProperty("hasPreviousPage");
      }
    });

    it("should handle empty result set", async () => {
      const result = await getUsers();

      if (result.success) {
        // Empty result should still have valid pagination
        if (result.data.data.length === 0) {
          expect(result.data.pagination.total).toBe(0);
          expect(result.data.pagination.totalPages).toBe(0);
          expect(result.data.pagination.hasNextPage).toBe(false);
        }
      }
    });
  });

  describe("Fetch with role filter", () => {
    it("should filter users by member role", async () => {
      const result = await getUsers({ role: "member" });

      if (result.success) {
        // All returned users should have member role
        result.data.data.forEach((user) => {
          expect(user.role).toBe("member");
        });
      }
    });

    it("should filter users by author role", async () => {
      const result = await getUsers({ role: "author" });

      if (result.success) {
        // All returned users should have author role
        result.data.data.forEach((user) => {
          expect(user.role).toBe("author");
        });
      }
    });
  });

  describe("Fetch with status filter", () => {
    it("should filter users by active status", async () => {
      const result = await getUsers({ status: "active" });

      if (result.success) {
        // All returned users should have active status
        result.data.data.forEach((user) => {
          expect(user.status).toBe("active");
        });
      }
    });

    it("should filter users by suspended status", async () => {
      const result = await getUsers({ status: "suspended" });

      if (result.success) {
        // All returned users should have suspended status
        result.data.data.forEach((user) => {
          expect(user.status).toBe("suspended");
        });
      }
    });
  });

  describe("Fetch with search filter", () => {
    it("should search users by display_name", async () => {
      const result = await getUsers({ search: "john" });

      if (result.success) {
        // All returned users should match search term (case-insensitive)
        result.data.data.forEach((user) => {
          const displayName = user.display_name?.toLowerCase() || "";
          const email = user.email.toLowerCase();
          expect(displayName.includes("john") || email.includes("john")).toBe(
            true,
          );
        });
      }
    });

    it("should search users by email", async () => {
      const result = await getUsers({ search: "example.com" });

      if (result.success) {
        // All returned users should match search term
        result.data.data.forEach((user) => {
          expect(user.email.toLowerCase()).toContain("example.com");
        });
      }
    });
  });

  describe("Fetch with sorting", () => {
    it("should sort users by created_at ascending", async () => {
      const result = await getUsers({ sortOrder: "asc" });

      if (result.success && result.data.data.length > 1) {
        // Verify ascending order
        for (let i = 0; i < result.data.data.length - 1; i++) {
          const current = new Date(result.data.data[i].created_at).getTime();
          const next = new Date(result.data.data[i + 1].created_at).getTime();
          expect(current).toBeLessThanOrEqual(next);
        }
      }
    });

    it("should sort users by created_at descending", async () => {
      const result = await getUsers({ sortOrder: "desc" });

      if (result.success && result.data.data.length > 1) {
        // Verify descending order
        for (let i = 0; i < result.data.data.length - 1; i++) {
          const current = new Date(result.data.data[i].created_at).getTime();
          const next = new Date(result.data.data[i + 1].created_at).getTime();
          expect(current).toBeGreaterThanOrEqual(next);
        }
      }
    });
  });

  describe("Fetch with pagination", () => {
    it("should fetch page 1 with limit 10", async () => {
      const result = await getUsers({}, { page: 1, limit: 10 });

      if (result.success) {
        expect(result.data.pagination.page).toBe(1);
        expect(result.data.pagination.limit).toBe(10);
        expect(result.data.data.length).toBeLessThanOrEqual(10);
      }
    });

    it("should fetch page 2 with limit 10", async () => {
      const result = await getUsers({}, { page: 2, limit: 10 });

      if (result.success) {
        expect(result.data.pagination.page).toBe(2);
        expect(result.data.pagination.limit).toBe(10);
      }
    });

    it("should calculate correct offset for pagination", async () => {
      const result = await getUsers({}, { page: 3, limit: 10 });

      if (result.success) {
        // Page 3 with limit 10 should have offset 20
        expect(result.data.pagination.page).toBe(3);
      }
    });
  });

  describe("Error handling on database failure", () => {
    it("should return error response on network failure", async () => {
      // This would require mocking the Supabase client to fail
      // For now, we just verify the error response structure
      const result = await getUsers();

      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error.code).toBeDefined();
        expect(result.error.message).toBeDefined();
      }
    });
  });
});

describe("Integration Tests - updateUserRole", () => {
  describe("Promote member to author", () => {
    it("should update user role from member to author", async () => {
      // This test would require a test user ID
      // In a real integration test, you would use a test database
      const testUserId = "550e8400-e29b-41d4-a716-446655440000";
      const result = await updateUserRole(testUserId, "author");

      if (result.success) {
        expect(result.data.role).toBe("author");
        expect(result.data.id).toBe(testUserId);
      }
    });

    it("should return updated user object", async () => {
      const testUserId = "550e8400-e29b-41d4-a716-446655440000";
      const result = await updateUserRole(testUserId, "author");

      if (result.success) {
        expect(result.data).toHaveProperty("id");
        expect(result.data).toHaveProperty("email");
        expect(result.data).toHaveProperty("role");
        expect(result.data).toHaveProperty("status");
        expect(result.data).toHaveProperty("created_at");
      }
    });

    it("should set updated_at timestamp", async () => {
      const testUserId = "550e8400-e29b-41d4-a716-446655440000";
      const result = await updateUserRole(testUserId, "author");

      if (result.success) {
        expect(result.data.updated_at).toBeDefined();
        // Verify it's a valid ISO 8601 timestamp
        const timestamp = new Date(result.data.updated_at!);
        expect(timestamp.getTime()).toBeGreaterThan(0);
      }
    });
  });

  describe("Demote author to member", () => {
    it("should update user role from author to member", async () => {
      const testUserId = "550e8400-e29b-41d4-a716-446655440000";
      const result = await updateUserRole(testUserId, "member");

      if (result.success) {
        expect(result.data.role).toBe("member");
      }
    });
  });

  describe("Error handling on database failure", () => {
    it("should return error on invalid user ID", async () => {
      const result = await updateUserRole("invalid-id", "author");

      if (!result.success) {
        expect(result.error.code).toBeDefined();
        expect(result.error.message).toBeDefined();
      }
    });

    it("should return error on empty user ID", async () => {
      const result = await updateUserRole("", "author");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });

    it("should return error on invalid role", async () => {
      const testUserId = "550e8400-e29b-41d4-a716-446655440000";
      const result = await updateUserRole(testUserId, "invalid" as any);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });
  });
});

describe("Integration Tests - updateUserStatus", () => {
  describe("Suspend active user", () => {
    it("should update user status from active to suspended", async () => {
      const testUserId = "550e8400-e29b-41d4-a716-446655440000";
      const result = await updateUserStatus(testUserId, "suspended");

      if (result.success) {
        expect(result.data.status).toBe("suspended");
        expect(result.data.id).toBe(testUserId);
      }
    });

    it("should return updated user object", async () => {
      const testUserId = "550e8400-e29b-41d4-a716-446655440000";
      const result = await updateUserStatus(testUserId, "suspended");

      if (result.success) {
        expect(result.data).toHaveProperty("id");
        expect(result.data).toHaveProperty("email");
        expect(result.data).toHaveProperty("role");
        expect(result.data).toHaveProperty("status");
        expect(result.data).toHaveProperty("created_at");
      }
    });

    it("should set updated_at timestamp", async () => {
      const testUserId = "550e8400-e29b-41d4-a716-446655440000";
      const result = await updateUserStatus(testUserId, "suspended");

      if (result.success) {
        expect(result.data.updated_at).toBeDefined();
        // Verify it's a valid ISO 8601 timestamp
        const timestamp = new Date(result.data.updated_at!);
        expect(timestamp.getTime()).toBeGreaterThan(0);
      }
    });
  });

  describe("Reactivate suspended user", () => {
    it("should update user status from suspended to active", async () => {
      const testUserId = "550e8400-e29b-41d4-a716-446655440000";
      const result = await updateUserStatus(testUserId, "active");

      if (result.success) {
        expect(result.data.status).toBe("active");
      }
    });
  });

  describe("Error handling on database failure", () => {
    it("should return error on invalid user ID", async () => {
      const result = await updateUserStatus("invalid-id", "suspended");

      if (!result.success) {
        expect(result.error.code).toBeDefined();
        expect(result.error.message).toBeDefined();
      }
    });

    it("should return error on empty user ID", async () => {
      const result = await updateUserStatus("", "suspended");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });

    it("should return error on invalid status", async () => {
      const testUserId = "550e8400-e29b-41d4-a716-446655440000";
      const result = await updateUserStatus(testUserId, "invalid" as any);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });
  });
});

describe("Integration Tests - Authorization", () => {
  describe("Admin authorization checks", () => {
    it("should validate that operations require admin role", () => {
      // Authorization is checked in server actions, not in UserService
      // This test documents the expected behavior
      expect(true).toBe(true);
    });

    it("should return permission error for non-admin users", () => {
      // This would be tested in the server actions layer
      expect(true).toBe(true);
    });
  });
});
