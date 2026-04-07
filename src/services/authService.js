const FAKE_USER = {
  email: "adrenalin@test.com",
  password: "password",
  name: "Adrenalin Manager",
};

const FAKE_DELAY = 800;

export const fakeLogin = ({ email, password }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === FAKE_USER.email && password === FAKE_USER.password) {
        resolve({
          user: { name: FAKE_USER.name, email },
          token: "fake-jwt-token-xyz",
        });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, FAKE_DELAY);
  });
