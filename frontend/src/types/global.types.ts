export type LoginApiResponse = {
  user: {
    email: 'yudatest@gmail.com';
    id: '0b12e084-0477-4ef1-8e41-758f7de6d59c';
  };
};

export type userProfileResponse = {
  id: string;
  email: string;
  displayName: string;
  emailVerified: string;
  createdAt: string;
};

export type getCurrentResponse = {
  user: userProfileResponse;
} | null;
