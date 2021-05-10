import test from "tape";
import goLinks from "./";
import { memory } from "./memory";

test("goLinks with memory storage", (t) => {
  const client = goLinks({
    storage: memory(),
  });

  t.test("should able to get link after adding it", async (t) => {
    t.plan(1);

    const id = "new";
    const url = "https://www.example.com/new";

    await client.add({ id, url });
    const link = await client.get({ id });
    t.deepEquals(link, { id, url });
    t.end();
  });

  t.test("should able to remove link if exists", async (t) => {
    t.plan(1);

    const id = "new";
    await client.remove({ id });

    try {
      await client.get({ id });
    } catch (err: unknown) {
      if (err instanceof Error) {
        t.equals(err.message, `link cannot be found with id '${id}'`);
      } else {
        t.fail("err should be instanceof Error");
      }
    }
    t.end();
  });

  t.test("throw error if remove unknown link", async (t) => {
    t.plan(1);
    const id = "new";

    try {
      await client.remove({ id });
    } catch (err: unknown) {
      if (err instanceof Error) {
        t.equals(err.message, `link cannot be found with id '${id}'`);
      } else {
        t.fail("err should be instanceof Error");
      }
    }
    t.end();
  });
  t.end();
});
