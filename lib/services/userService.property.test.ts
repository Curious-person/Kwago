import { describe, it } from "vitest";
import fc from "fast-check";
import { validateUser } from "./userService";

/**
 * Property-Based Tests for User Data Validation
 *
 * **Validates: Requirements 6.2, 6.3, 6.4, 6.5, 6.7**
 *
 * Property 7: User data validation enforces schema constraints
 *
 * For any profile data, the validation function SHALL reject profiles with:
 * - Missing required fields (except avatar_url which may be null)
 * - Invalid role values (not in 'member', 'author', 'admin')
 * - Invalid status values (not in 'active', 'suspended')
 * Valid profiles SHALL pass validation.
 */
describe("validateUser - Property-Based Tests", () => {
  // Generators for valid data
  const uuidArbitrary = () =>
    fc
      .tuple(
        fc.stringMatching(/^[0-9a-f]{8}$/),
        fc.stringMatching(/^[0-9a-f]{4}$/),
        fc.stringMatching(/^[0-9a-f]{4}$/),
        fc.stringMatching(/^[0-9a-f]{4}$/),
        fc.stringMatching(/^[0-9a-f]{12}$/),
      )
      .map(([a, b, c, d, e]) => `${a}-${b}-${c}-${d}-${e}`);

  const emailArbitrary = () =>
    fc.emailAddress().map((email) => email.toLowerCase());

  const displayNameArbitrary = () =>
    fc.oneof(fc.constant(null), fc.stringMatching(/^[a-zA-Z\s]{1,50}$/));

  const avatarUrlArbitrary = () => fc.oneof(fc.constant(null), fc.webUrl());

  const roleArbitrary = () => fc.constantFrom("member", "author", "admin");

  const statusArbitrary = () => fc.constantFrom("active", "suspended");

  const iso8601TimestampArbitrary = () =>
    fc
      .tuple(
        fc.integer({ min: 2000, max: 2030 }),
        fc.integer({ min: 1, max: 12 }),
        fc.integer({ min: 1, max: 28 }),
        fc.integer({ min: 0, max: 23 }),
        fc.integer({ min: 0, max: 59 }),
        fc.integer({ min: 0, max: 59 }),
      )
      .map(([year, month, day, hour, minute, second]) => {
        const monthStr = String(month).padStart(2, "0");
        const dayStr = String(day).padStart(2, "0");
        const hourStr = String(hour).padStart(2, "0");
        const minuteStr = String(minute).padStart(2, "0");
        const secondStr = String(second).padStart(2, "0");
        return `${year}-${monthStr}-${dayStr}T${hourStr}:${minuteStr}:${secondStr}Z`;
      });

  const validUserArbitrary = () =>
    fc.record({
      id: uuidArbitrary(),
      email: emailArbitrary(),
      display_name: displayNameArbitrary(),
      avatar_url: avatarUrlArbitrary(),
      role: roleArbitrary(),
      status: statusArbitrary(),
      created_at: iso8601TimestampArbitrary(),
    });

  describe("Property 7: User data validation enforces schema constraints", () => {
    it("should accept all valid user profiles", () => {
      fc.assert(
        fc.property(validUserArbitrary(), (user) => {
          const result = validateUser(user);
          return result.success === true;
        }),
        { numRuns: 100 },
      );
    });

    it("should reject profiles with missing id field", () => {
      fc.assert(
        fc.property(validUserArbitrary(), (user) => {
          const { id, ...userWithoutId } = user;
          const result = validateUser(userWithoutId);
          return (
            result.success === false &&
            result.error.code === "VALIDATION_ERROR" &&
            result.error.details?.field === "id"
          );
        }),
        { numRuns: 100 },
      );
    });

    it("should reject profiles with missing email field", () => {
      fc.assert(
        fc.property(validUserArbitrary(), (user) => {
          const { email, ...userWithoutEmail } = user;
          const result = validateUser(userWithoutEmail);
          return (
            result.success === false &&
            result.error.code === "VALIDATION_ERROR" &&
            result.error.details?.field === "email"
          );
        }),
        { numRuns: 100 },
      );
    });

    it("should reject profiles with missing display_name field", () => {
      fc.assert(
        fc.property(validUserArbitrary(), (user) => {
          const { display_name, ...userWithoutDisplayName } = user;
          const result = validateUser(userWithoutDisplayName);
          return (
            result.success === false &&
            result.error.code === "VALIDATION_ERROR" &&
            result.error.details?.field === "display_name"
          );
        }),
        { numRuns: 100 },
      );
    });

    it("should reject profiles with missing role field", () => {
      fc.assert(
        fc.property(validUserArbitrary(), (user) => {
          const { role, ...userWithoutRole } = user;
          const result = validateUser(userWithoutRole);
          return (
            result.success === false &&
            result.error.code === "VALIDATION_ERROR" &&
            result.error.details?.field === "role"
          );
        }),
        { numRuns: 100 },
      );
    });

    it("should reject profiles with missing status field", () => {
      fc.assert(
        fc.property(validUserArbitrary(), (user) => {
          const { status, ...userWithoutStatus } = user;
          const result = validateUser(userWithoutStatus);
          return (
            result.success === false &&
            result.error.code === "VALIDATION_ERROR" &&
            result.error.details?.field === "status"
          );
        }),
        { numRuns: 100 },
      );
    });

    it("should reject profiles with missing created_at field", () => {
      fc.assert(
        fc.property(validUserArbitrary(), (user) => {
          const { created_at, ...userWithoutCreatedAt } = user;
          const result = validateUser(userWithoutCreatedAt);
          return (
            result.success === false &&
            result.error.code === "VALIDATION_ERROR" &&
            result.error.details?.field === "created_at"
          );
        }),
        { numRuns: 100 },
      );
    });

    it("should reject profiles with invalid role values", () => {
      fc.assert(
        fc.property(
          validUserArbitrary(),
          fc
            .stringMatching(/^[a-z]+$/)
            .filter((role) => !["member", "author", "admin"].includes(role)),
          (user, invalidRole) => {
            const result = validateUser({ ...user, role: invalidRole });
            return (
              result.success === false &&
              result.error.code === "VALIDATION_ERROR" &&
              result.error.details?.field === "role"
            );
          },
        ),
        { numRuns: 50 },
      );
    });

    it("should reject profiles with invalid status values", () => {
      fc.assert(
        fc.property(
          validUserArbitrary(),
          fc
            .stringMatching(/^[a-z]+$/)
            .filter((status) => !["active", "suspended"].includes(status)),
          (user, invalidStatus) => {
            const result = validateUser({ ...user, status: invalidStatus });
            return (
              result.success === false &&
              result.error.code === "VALIDATION_ERROR" &&
              result.error.details?.field === "status"
            );
          },
        ),
        { numRuns: 50 },
      );
    });

    it("should reject profiles with invalid id format", () => {
      fc.assert(
        fc.property(
          validUserArbitrary(),
          fc
            .stringMatching(/^[a-z0-9]+$/)
            .filter((id) => id.length > 0 && !id.includes("-")),
          (user, invalidId) => {
            const result = validateUser({ ...user, id: invalidId });
            return (
              result.success === false &&
              result.error.code === "VALIDATION_ERROR" &&
              result.error.details?.field === "id"
            );
          },
        ),
        { numRuns: 50 },
      );
    });

    it("should reject profiles with empty email", () => {
      fc.assert(
        fc.property(validUserArbitrary(), (user) => {
          const result = validateUser({ ...user, email: "" });
          return (
            result.success === false &&
            result.error.code === "VALIDATION_ERROR" &&
            result.error.details?.field === "email"
          );
        }),
        { numRuns: 50 },
      );
    });

    it("should reject profiles with empty id", () => {
      fc.assert(
        fc.property(validUserArbitrary(), (user) => {
          const result = validateUser({ ...user, id: "" });
          return (
            result.success === false &&
            result.error.code === "VALIDATION_ERROR" &&
            result.error.details?.field === "id"
          );
        }),
        { numRuns: 50 },
      );
    });

    it("should reject profiles with invalid created_at timestamp", () => {
      fc.assert(
        fc.property(
          validUserArbitrary(),
          fc.stringMatching(/^[a-z0-9]+$/),
          (user, invalidTimestamp) => {
            const result = validateUser({
              ...user,
              created_at: invalidTimestamp,
            });
            return (
              result.success === false &&
              result.error.code === "VALIDATION_ERROR" &&
              result.error.details?.field === "created_at"
            );
          },
        ),
        { numRuns: 50 },
      );
    });

    it("should accept profiles with null display_name", () => {
      fc.assert(
        fc.property(validUserArbitrary(), (user) => {
          const result = validateUser({ ...user, display_name: null });
          return result.success === true;
        }),
        { numRuns: 50 },
      );
    });

    it("should accept profiles with null avatar_url", () => {
      fc.assert(
        fc.property(validUserArbitrary(), (user) => {
          const result = validateUser({ ...user, avatar_url: null });
          return result.success === true;
        }),
        { numRuns: 50 },
      );
    });

    it("should always return error response with code and message on validation failure", () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(null),
            fc.constant([]),
            fc.constant("string"),
            fc.constant(123),
          ),
          (invalidData) => {
            const result = validateUser(invalidData);
            return (
              result.success === false &&
              result.error.code === "VALIDATION_ERROR" &&
              typeof result.error.message === "string" &&
              result.error.message.length > 0
            );
          },
        ),
        { numRuns: 50 },
      );
    });

    it("should always return success response with data on valid input", () => {
      fc.assert(
        fc.property(validUserArbitrary(), (user) => {
          const result = validateUser(user);
          return (
            result.success === true &&
            result.data !== undefined &&
            result.data.id === user.id &&
            result.data.email === user.email &&
            result.data.role === user.role &&
            result.data.status === user.status
          );
        }),
        { numRuns: 100 },
      );
    });
  });
});
