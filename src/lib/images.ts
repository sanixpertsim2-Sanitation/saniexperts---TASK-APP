// Helper to get correct image URL for deployment
export function img(path: string): string {
  const cleanPath = path.replace(/^\.?\//, '');
  return import.meta.env.BASE_URL + cleanPath;
}

// OmniTask Premium Logo
export const LOGO = img('omnitask-logo.png');

// Avatars
export const AVATARS = {
  employee1: img('avatars/avatar-employee-1.jpg'),
  employee2: img('avatars/avatar-employee-2.jpg'),
  employee3: img('avatars/avatar-employee-3.jpg'),
  leader1: img('avatars/avatar-leader-1.jpg'),
};

// Photos
export const PHOTOS = {
  cleaning1: img('photos/task-photo-cleaning-1.jpg'),
  cleaning2: img('photos/task-photo-cleaning-2.jpg'),
  damage1: img('photos/damage-photo-1.jpg'),
};
