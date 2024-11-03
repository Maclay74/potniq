import * as Jose from "jose";

function getToken(headers: Request['headers']) {
  return headers.get("authorization")?.split(" ")[1];
}

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);

const users: Record<string, object> = {
  "mishakozlov74@gmail.com": {
    id: 1,
    name: "Mike Finch",
    isAdmin: true,
  }
}

export const authorize = async (req: Request) => {
  const token = getToken(req.headers);
  if (!token) return false;

  try {
    const { payload } = await Jose.jwtVerify<{email: string}>(token, jwtSecret);
    return users[payload.email]
  } catch (e) {
    console.log("Couldn't authorize")
    return false;
  }
};
