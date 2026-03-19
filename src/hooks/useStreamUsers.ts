/**
 * 🎣 CUSTOM HOOK: useStreamUsers
 *
 * Fetches and manages Stream Chat users excluding:
 * - Current user (self)
 * - Admin users
 *
 * Perfect for:
 * - User lists for starting new chats
 * - Member selection in group creation
 * - User directories
 */

import { useEffect, useState } from 'react';
import type { StreamChat, UserResponse } from 'stream-chat';

/**
 * @param client - Initialized Stream Chat client instance
 * @param userId - Current user's ID (to exclude from results)
 * @returns { users, loading } - Array of users + loading state
 */
const useStreamUsers = (client: StreamChat, userId: string) => {
  // 📦 State management
  const [users, setUsers] = useState<UserResponse[]>([]); // Fetched users
  const [loading, setLoading] = useState(true); // Loading status

  /**
   * 🔄 FETCH USERS EFFECT
   * Runs when client or userId changes
   */
  useEffect(() => {
    /**
     * 📥 Async function to query Stream users
     * Separated to use async/await inside useEffect
     */
    const fetchUsers = async () => {
      // 🚦 Start loading
      setLoading(true);

      try {
        /**
         * 🔍 STREAM QUERY USERS
         *
         * Parameters:
         * 1. Filters - What users to fetch
         *    - id: { $nin: [userId] } → Not In [current user]
         *    - role: { $nin: ['admin'] } → Not In ['admin']
         *
         * 2. Sort - How to order results
         *    - { last_active: -1 } → Most recent first
         *
         * 3. Options - Pagination/limits
         *    - { limit: 50 } → Max 50 users
         *
         * The 'as any' type assertion is needed because Stream's
         * types are strict about filter operators
         */
        const response = await client.queryUsers(
          {
            id: { $nin: [userId] }, // Exclude current user
            role: { $nin: ['admin'] }, // Exclude admins
          } as any,
          { last_active: -1 }, // Sort by last active (newest first)
          { limit: 50 }, // Pagination limit
        );

        // ✅ Update state with fetched users
        setUsers(response.users);
      } catch (error) {
        /**
         * ❌ ERROR HANDLING
         * Log error for debugging
         * TODO: Add Sentry integration for production error tracking
         */
        console.error('❌ Failed to fetch users from Stream:', error);
        // TODO: Add Sentry.log(error) or similar error tracking
      } finally {
        // 🏁 Always stop loading, even on error
        setLoading(false);
      }
    };

    // 🚀 Only fetch if we have a valid userId
    if (userId) {
      fetchUsers();
    }
  }, [client, userId]); // 🔄 Re-run if client or userId changes

  // 📤 Return users and loading state to components
  return { users, loading };
};

export default useStreamUsers;

/**
 * 📚 HOOK FLOW REVISION:
 *
 * ┌─────────────────────────────────────────────────────┐
 * │                    COMPONENT                         │
 * │  const { users, loading } = useStreamUsers(client, userId)
 * └─────────────────────────────────────────────────────┘
 *                            │
 *                            ▼
 * ┌─────────────────────────────────────────────────────┐
 * │                    HOOK INIT                          │
 * │  useState([])    useState(true)                       │
 * │  users = []      loading = true                        │
 * └─────────────────────────────────────────────────────┘
 *                            │
 *                            ▼
 * ┌─────────────────────────────────────────────────────┐
 * │                useEffect RUNS                         │
 * │  Checks if userId exists                              │
 * └─────────────────────────────────────────────────────┘
 *                            │
 *                            ▼
 * ┌─────────────────────────────────────────────────────┐
 * │                fetchUsers() CALLED                    │
 * ├───────────────────────────────────────────────────────┤
 * │  setLoading(true)                                      │
 * │         ↓                                              │
 * │  client.queryUsers({                                   │
 * │    filter: {                                           │
 * │      id: { $nin: [userId] },  // Not me               │
 * │      role: { $nin: ['admin'] } // Not admin           │
 * │    },                                                  │
 * │    sort: { last_active: -1 },   // Recent first       │
 * │    limit: 50                    // Max 50 users       │
 * │  })                                                    │
 * │         ↓                                              │
 * │  ┌─────────────────────────────────────────────────┐  │
 * │  │              SUCCESS           ❌ ERROR          │  │
 * │  │   setUsers(response.users)    console.error      │  │
 * │  └─────────────────────────────────────────────────┘  │
 * │         ↓                                              │
 * │  setLoading(false) // Always execute                   │
 * └─────────────────────────────────────────────────────┘
 *                            │
 *                            ▼
 * ┌─────────────────────────────────────────────────────┐
 * │                    RETURN VALUES                      │
 * │  { users: [...], loading: false }                     │
 * └─────────────────────────────────────────────────────┘
 *                            │
 *                            ▼
 * ┌─────────────────────────────────────────────────────┐
 * │                    COMPONENT RENDERS                  │
 * │  if (loading) → Show spinner                          │
 * │  else → Map through users and display                 │
 * └─────────────────────────────────────────────────────┘
 *
 * 🔑 KEY CONCEPTS:
 *
 * 1. 🎯 Stream Query Operators:
 *    ┌─────────────┬─────────────────────────────┐
 *    │ Operator    │ Meaning                     │
 *    ├─────────────┼─────────────────────────────┤
 *    │ $eq         │ Equal to                    │
 *    │ $neq        │ Not equal to                │
 *    │ $in         │ In array                    │
 *    │ $nin        │ Not in array                │
 *    │ $exists     │ Field exists                │
 *    └─────────────┴─────────────────────────────┘
 *
 * 2. 📊 Sort Directions:
 *    ┌─────────────┬─────────────────────────────┐
 *    │ Value       │ Meaning                     │
 *    ├─────────────┼─────────────────────────────┤
 *    │ 1           │ Ascending (A → Z)           │
 *    │ -1          │ Descending (Z → A)          │
 *    └─────────────┴─────────────────────────────┘
 *
 * 3. 🔄 Effect Dependencies:
 *    - `client`: Re-fetch if client changes (rare)
 *    - `userId`: Re-fetch if user changes (switch accounts)
 *
 * 4. 🚦 Loading States:
 *    - `true` at start
 *    - `false` after success OR error
 *    - Always handle both cases in UI
 *
 * 💡 USAGE EXAMPLES:
 *
 * ```tsx
 * // 1. Basic usage
 * const { users, loading } = useStreamUsers(chatClient, user.id);
 *
 * if (loading) return <Spinner />;
 *
 * return (
 *   <FlatList
 *     data={users}
 *     renderItem={({ item }) => <UserItem user={item} />}
 *   />
 * );
 *
 * // 2. With search/filter
 * const filteredUsers = users.filter(user =>
 *   user.name?.toLowerCase().includes(searchTerm)
 * );
 *
 * // 3. For starting a new chat
 * const startChatWith = (selectedUser) => {
 *   const channel = chatClient.channel('messaging', {
 *     members: [user.id, selectedUser.id]
 *   });
 *   // Navigate to channel...
 * };
 * ```
 *
 * 🚀 OPTIMIZATION TIPS:
 *
 * • Add debounced search to reduce queries:
 *   ```ts
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearch = useDebounce(searchTerm, 300);
 *   ```
 *
 * • Implement pagination for large user bases:
 *   ```ts
 *   const [offset, setOffset] = useState(0);
 *   const response = await client.queryUsers(
 *     filters,
 *     sort,
 *     { limit: 20, offset }
 *   );
 *   ```
 *
 * • Cache results with React Query:
 *   ```ts
 *   const { data } = useQuery(['users', userId], () =>
 *     fetchUsers()
 *   );
 *   ```
 *
 * • Add refresh capability:
 *   ```ts
 *   const refresh = () => {
 *     setLoading(true);
 *     fetchUsers();
 *   };
 *   return { users, loading, refresh };
 *   ```
 */
