import * as z from 'zod';

export const schema = {
  signin: z.object({
    email: z
      .string({
        required_error: '이메일을 입력해주세요.',
      })
      .email('이메일 형식이 올바르지 않습니다.'),
    password: z
      .string({
        required_error: '비밀번호를 입력해주세요.',
      })
      .min(6, '비밀번호는 6자 이상이어야 합니다.'),
  }),
  signup: z
    .object({
      name: z
        .string({
          required_error: '닉네임을 입력해주세요.',
        })
        .min(2, '닉네임은 2자 이상이어야 합니다.'),
      email: z
        .string({
          required_error: '이메일을 입력해주세요.',
        })
        .email('이메일 형식이 올바르지 않습니다.'),
      password: z
        .string({
          required_error: '비밀번호를 입력해주세요.',
        })
        .min(6, '비밀번호는 6자 이상이어야 합니다.'),
      passwordConfirm: z
        .string({
          required_error: '비밀번호 확인을 입력해주세요.',
        })
        .min(6, '비밀번호 확인은 6자 이상이어야 합니다.'),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: '비밀번호가 일치하지 않습니다.',
      path: ['passwordConfirm'],
    }),
};

export type SigninData = z.infer<typeof schema.signin>;

export type SignupData = z.infer<typeof schema.signup>;
