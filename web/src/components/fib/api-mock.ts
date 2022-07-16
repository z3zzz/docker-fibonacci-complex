import { rest, RequestHandler } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';

interface Get {
  [key: string]: any;
}

interface Update {
  data: any;
  afterPost: Record<string, any>;
}

interface Post {
  [key: string]: {
    response: any;
    updates?: Update[];
  };
}

interface ApiList {
  get?: Get;
  post?: Post;
}

class MockServer {
  private apiList!: ApiList;
  private handlers: RequestHandler[] = [];
  private server!: SetupServerApi;

  async listen() {
    try {
      this.apiList = await import('./api-mock.json');
    } catch (e) {
      if (e instanceof SyntaxError) {
        console.error(`Please check syntax of api-mock.json\n${e.message}`);
      } else {
        console.error("'api-mock.json' file not found. Api mocking failed");
      }

      process.exit(1);
    }

    const { get, post } = this.apiList;

    if (get) {
      this.mockGetResponse(get);
    }

    if (post) {
      this.mockPostResponse(post);
    }

    this.server = setupServer(...this.handlers);
    this.server.listen();
  }

  close() {
    this.server.close();
  }

  private mockGetResponse(get: Get) {
    for (const url of Object.keys(get)) {
      const handler = rest.get(url, (req, res, ctx) => {
        const responseValue = get[url];

        return res(ctx.json(responseValue));
      });

      this.handlers.push(handler);
    }
  }

  private mockPostResponse(post: Post) {
    for (const url of Object.keys(post)) {
      const handler = rest.post(url, (req, res, ctx) => {
        const { updates, response } = post[url];

        if (updates && updates.length !== 0) {
          const update = updates.find((update) => {
            return JSON.stringify(update.data) === JSON.stringify(req.body);
          });

          update && this.updateResponse(update);
        }

        return res(ctx.json(response));
      });

      this.handlers.push(handler);
    }
  }

  private updateResponse(update: Update) {
    const { afterPost } = update;
    const { get } = this.apiList;

    if (!get) {
      console.log("'get' not specified in api-mock.json. Update not possible");

      return;
    }

    for (const [url, newValue] of Object.entries(afterPost)) {
      if (!get[url]) {
        console.log(
          `Get request for ${url} not specified in api-mock.json. Update not possible.`
        );

        continue;
      }

      get[url] = newValue;
    }
  }
}

const mockServer = new MockServer();

export { mockServer };
