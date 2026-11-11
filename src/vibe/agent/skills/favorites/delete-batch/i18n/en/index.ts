export const translations = {
  category: "Chat",
  tags: {
    favorites: "Favorites",
  },
  post: {
    title: "Remove Favorites",
    titleShort: "Remove",
    description: "Remove several favorites in one go",
    ids: {
      label: "Favorite IDs",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Please check what you're removing and try again",
      },
      network: {
        title: "Connection Error",
        description: "Unable to remove the favorites. Please try again",
      },
      unauthorized: {
        title: "Sign In Required",
        description: "Please sign in to remove your favorites",
      },
      forbidden: {
        title: "Permission Denied",
        description: "You don't have permission to remove these favorites",
      },
      notFound: {
        title: "Favorites Not Found",
        description: "We couldn't find the favorites to remove",
      },
      server: {
        title: "Something Went Wrong",
        description: "We couldn't remove your favorites. Please try again",
      },
      unknown: {
        title: "Unexpected Error",
        description: "Something unexpected happened. Please try again",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Your changes haven't been saved yet",
      },
      conflict: {
        title: "Removal Conflict",
        description: "These favorites changed. Please refresh and try again",
      },
    },
    success: {
      title: "Favorites Removed",
      description: "The selected favorites have been removed",
    },
  },
};
