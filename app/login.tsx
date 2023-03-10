import type { ActionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { db } from './utils/db.server';
import { badRequest } from './utils/request.server';

function validateEmail(email: unknown) {
  if (typeof email !== 'string' || email.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 6) {
    return `Passwords must be at least 3 characters long`;
  }
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const email = form.get('email');
  const password = form.get('password');

  // type check values of input
  if (
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  // create 'fields' and 'fieldErrors' objects
  const fields = { email, password };
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  // find user by email // this will be extrapolated into it's own session.server.ts file into a 'login' function that accepts our fields, that login function will run against our db and perform a bcrypt compare of passwords
  const foundUser = await db.user.findFirst({
    where: {
      email: email
    }
  })
  if (!foundUser) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: `User with email ${email} does not exists`,
    });
  }

  return badRequest({
    fieldErrors: null,
    fields,
    formError: `Not implemented`,
  });
};

export default function Login() {
  const actionData = useActionData<typeof action>()

  return (
    <div>
      <Form method='post'>
        <input
          type='text'
          name='email'
          id='email-input'
          placeholder='email'
          defaultValue={actionData?.fields?.email}
          />
        <input
          type='text'
          name='password'
          id='password-input'
          placeholder='password'
          defaultValue={actionData?.fields?.password}
        />
        <button type='submit'>Login</button>
      </Form>
    </div>
  );
}
