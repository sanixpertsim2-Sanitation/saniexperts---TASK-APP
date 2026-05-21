// Helper to get correct image URL for GitHub Pages
// Uses Vite's BASE_URL which is /saniexperts---TASK-APP/ on GitHub Pages
export function img(path: string): string {
  // Remove leading ./ or / if present
  const cleanPath = path.replace(/^\.?\//, '');
  // Prepend Vite's base URL
  return import.meta.env.BASE_URL + cleanPath;
}

// Pre-built paths for commonly used images
export const LOGO = img('sanixperts-logo.png');

export const AVATARS = {
  employee1: img('avatars/avatar-employee-1.jpg'),
  employee2: img('avatars/avatar-employee-2.jpg'),
  employee3: img('avatars/avatar-employee-3.jpg'),
  leader1: img('avatars/avatar-leader-1.jpg'),
};

export const PHOTOS = {
  cleaning1: img('photos/task-photo-cleaning-1.jpg'),
  cleaning2: img('photos/task-photo-cleaning-2.jpg'),
  damage1: img('photos/damage-photo-1.jpg'),
};
