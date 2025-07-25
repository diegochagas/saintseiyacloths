import { SaintProps } from "@/pages/api/classes";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Saint Seiya Character";
export const size = {
  width: 542,
  height: 400,
};

export const contentType = "image/jpg";

const baseURL = "https://www.saintseiyacloths.com";

async function getSaint(id: string): Promise<SaintProps> {
  const response = await fetch(`${baseURL}/api/classes/${id}`, {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  });

  const saint = await response.json();

  return saint;
}

export default async function Image({ params }: { params: { id: string } }) {
  const saint = await getSaint(params.id);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {saint?.image && (
          <img
            src={`${baseURL}${saint.image}`}
            alt=""
            style={{ width: "100%" }}
          />
        )}
      </div>
    ),
    {
      ...size,
    }
  );
}
