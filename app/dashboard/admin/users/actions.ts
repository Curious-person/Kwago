"use server";

import { getCurrentUser, getUserRole } from "@/lib/auth";
import {
  ServiceResponse,
  PaginatedResponse,
  User,
  UserQueryFilters,
  PaginationParams,
  createErrorResponse,
} from "@/lib/services/userService";
import {
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "@/lib/services/userService";

/**
 * checkAdminRole helper function
 *
 * Verifies that the current user is authenticated and has admin role.
 * This function is used to authorize all user management actions.
 *
 * @returns Promise<boolean> - true if user is admin, false otherwise
 * @throws Error if user is not authenticated
 */
async function checkAdminRole(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const role = await getUserRole();
  return role === "admin";
}

/**
 * getUsersAction server action
 *
 * Fetches users from Supabase with optional filters and pagination.
 * This is the main entry point for the UsersManager component to fetch user data.
 *
 * Authorization: Admin only
 *
 * @param filters - Optional filters (role, status, search, sortBy, sortOrder)
 * @param pagination - Optional pagination parameters (page, limit)
 * @returns ServiceResponse<PaginatedResponse<User>> - Paginated list of users or error
 */
export async function getUsersAction(
  filters?: UserQueryFilters,
  pagination?: PaginationParams,
): Promise<ServiceResponse<PaginatedResponse<User>>> {
  try {
    // Check admin authorization
    const isAdmin = await checkAdminRole();
    if (!isAdmin) {
      return createErrorResponse(
        "PERMISSION_ERROR",
        "You don't have permission to perform this action.",
      );
    }

    // Call UserService to fetch users
    const result = await getUsers(filters, pagination);
    return result;
  } catch (error) {
    console.error("[getUsersAction] Error:", error);
    return createErrorResponse(
      "UNKNOWN_ERROR",
      "An unexpected error occurred. Please try again later.",
    );
  }
}

/**
 * promoteUserAction server action
 *
 * Promotes a member user to author role.
 * This action updates the user's role in the Supabase profiles table.
 *
 * Authorization: Admin only
 *
 * @param userId - The ID of the user to promote
 * @returns ServiceResponse<User> - Updated user object or error
 */
export async function promoteUserAction(
  userId: string,
): Promise<ServiceResponse<User>> {
  try {
    // Check admin authorization
    const isAdmin = await checkAdminRole();
    if (!isAdmin) {
      return createErrorResponse(
        "PERMISSION_ERROR",
        "You don't have permission to perform this action.",
      );
    }

    // Validate userId
    if (!userId || typeof userId !== "string") {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid user ID provided.",
      );
    }

    // Call UserService to update role
    const result = await updateUserRole(userId, "author");
    return result;
  } catch (error) {
    console.error("[promoteUserAction] Error:", error);
    return createErrorResponse(
      "UNKNOWN_ERROR",
      "An unexpected error occurred. Please try again later.",
    );
  }
}

/**
 * demoteUserAction server action
 *
 * Demotes an author user to member role.
 * This action updates the user's role in the Supabase profiles table.
 *
 * Authorization: Admin only
 *
 * @param userId - The ID of the user to demote
 * @returns ServiceResponse<User> - Updated user object or error
 */
export async function demoteUserAction(
  userId: string,
): Promise<ServiceResponse<User>> {
  try {
    // Check admin authorization
    const isAdmin = await checkAdminRole();
    if (!isAdmin) {
      return createErrorResponse(
        "PERMISSION_ERROR",
        "You don't have permission to perform this action.",
      );
    }

    // Validate userId
    if (!userId || typeof userId !== "string") {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid user ID provided.",
      );
    }

    // Call UserService to update role
    const result = await updateUserRole(userId, "member");
    return result;
  } catch (error) {
    console.error("[demoteUserAction] Error:", error);
    return createErrorResponse(
      "UNKNOWN_ERROR",
      "An unexpected error occurred. Please try again later.",
    );
  }
}

/**
 * suspendUserAction server action
 *
 * Suspends an active user account.
 * This action updates the user's status in the Supabase profiles table.
 *
 * Authorization: Admin only
 *
 * @param userId - The ID of the user to suspend
 * @returns ServiceResponse<User> - Updated user object or error
 */
export async function suspendUserAction(
  userId: string,
): Promise<ServiceResponse<User>> {
  try {
    // Check admin authorization
    const isAdmin = await checkAdminRole();
    if (!isAdmin) {
      return createErrorResponse(
        "PERMISSION_ERROR",
        "You don't have permission to perform this action.",
      );
    }

    // Validate userId
    if (!userId || typeof userId !== "string") {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid user ID provided.",
      );
    }

    // Call UserService to update status
    const result = await updateUserStatus(userId, "suspended");
    return result;
  } catch (error) {
    console.error("[suspendUserAction] Error:", error);
    return createErrorResponse(
      "UNKNOWN_ERROR",
      "An unexpected error occurred. Please try again later.",
    );
  }
}

/**
 * reactivateUserAction server action
 *
 * Reactivates a suspended user account.
 * This action updates the user's status in the Supabase profiles table.
 *
 * Authorization: Admin only
 *
 * @param userId - The ID of the user to reactivate
 * @returns ServiceResponse<User> - Updated user object or error
 */
export async function reactivateUserAction(
  userId: string,
): Promise<ServiceResponse<User>> {
  try {
    // Check admin authorization
    const isAdmin = await checkAdminRole();
    if (!isAdmin) {
      return createErrorResponse(
        "PERMISSION_ERROR",
        "You don't have permission to perform this action.",
      );
    }

    // Validate userId
    if (!userId || typeof userId !== "string") {
      return createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid user ID provided.",
      );
    }

    // Call UserService to update status
    const result = await updateUserStatus(userId, "active");
    return result;
  } catch (error) {
    console.error("[reactivateUserAction] Error:", error);
    return createErrorResponse(
      "UNKNOWN_ERROR",
      "An unexpected error occurred. Please try again later.",
    );
  }
}
