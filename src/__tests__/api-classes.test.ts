import handler, {
  getClasses,
  getContentByPage,
  getLatestSaints,
} from "@/pages/api/classes";
import idHandler from "@/pages/api/classes/[id]";
import saintsJson from "@/pages/api/data/saints.json";
import classesJson from "@/pages/api/data/classes.json";
import type { NextApiRequest, NextApiResponse } from "next";

function mockRes() {
  const res = {} as NextApiResponse;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const mockReq = (query: Record<string, string>) =>
  ({ query } as unknown as NextApiRequest);

describe("getContentByPage", () => {
  const items = Array.from({ length: 30 }, (_, i) => ({ id: `${i}` }));

  it("returns empty results for an empty list", () => {
    expect(getContentByPage([], "1")).toEqual({
      data: [],
      resultInitial: 0,
      resultLast: 0,
      totalPages: 0,
      totalResults: 0,
    });
  });

  it("returns the first page with 12 items", () => {
    const content = getContentByPage(items, "1");

    expect(content.data).toHaveLength(12);
    expect(content.resultInitial).toBe(1);
    expect(content.resultLast).toBe(12);
    expect(content.totalPages).toBe(3);
    expect(content.totalResults).toBe(30);
  });

  it("returns the remaining items on the last page", () => {
    const content = getContentByPage(items, "3");

    expect(content.data).toHaveLength(6);
    expect(content.resultInitial).toBe(25);
    expect(content.resultLast).toBe(30);
  });
});

describe("getLatestSaints", () => {
  it("returns the 10 most recent saints with loaded data", () => {
    const latest = getLatestSaints();

    expect(latest).toHaveLength(10);
    expect(latest[latest.length - 1].id).toBe(
      saintsJson[saintsJson.length - 1].id
    );
    expect(latest[0]).toHaveProperty("cloth");
    expect(latest[0]).toHaveProperty("image");
  });
});

describe("getClasses", () => {
  it("returns every class with its god expanded", () => {
    const classes = getClasses();

    expect(classes).toHaveLength(classesJson.length);
    const withGod = classes.find((cls) => cls.god);
    expect(withGod?.god).toHaveProperty("id");
  });
});

describe("/api/classes handler", () => {
  it("responds with the latest saints for q=latest", () => {
    const res = mockRes();
    handler(mockReq({ q: "latest" }), res);

    expect(res.status).toHaveBeenCalledWith(200);
    const payload = (res.json as jest.Mock).mock.calls[0][0];
    expect(payload.data).toHaveLength(10);
  });

  it("responds with all classes when there is no query", () => {
    const res = mockRes();
    handler(mockReq({}), res);

    expect(res.status).toHaveBeenCalledWith(200);
    const payload = (res.json as jest.Mock).mock.calls[0][0];
    expect(payload).toHaveLength(classesJson.length);
  });

  it("responds with paginated groups for a known class", () => {
    const res = mockRes();
    handler(mockReq({ q: classesJson[0].id, p: "1" }), res);

    expect(res.status).toHaveBeenCalledWith(200);
    const payload = (res.json as jest.Mock).mock.calls[0][0];
    expect(Array.isArray(payload.data)).toBe(true);
    expect(payload.totalResults).toBeGreaterThan(0);
  });

  it("responds 400 for an unknown class", () => {
    const res = mockRes();
    handler(mockReq({ q: "not-a-class" }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("/api/classes/[id] handler", () => {
  it("responds with the saint and its other versions", () => {
    const res = mockRes();
    idHandler(mockReq({ id: saintsJson[0].id }), res);

    expect(res.status).toHaveBeenCalledWith(200);
    const payload = (res.json as jest.Mock).mock.calls[0][0];
    expect(payload.id).toBe(saintsJson[0].id);
    expect(Array.isArray(payload.others)).toBe(true);
  });

  it("responds 400 for an unknown id", () => {
    const res = mockRes();
    idHandler(mockReq({ id: "does-not-exist" }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
