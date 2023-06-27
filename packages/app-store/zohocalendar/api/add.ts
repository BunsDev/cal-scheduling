import type { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";

import { WEBAPP_URL } from "@calcom/lib/constants";
import { defaultHandler, defaultResponder } from "@calcom/lib/server";

import { encodeOAuthState } from "../../_utils/encodeOAuthState";
import getAppKeysFromSlug from "../../_utils/getAppKeysFromSlug";
import config from "../config.json";
import { appKeysSchema as zohoKeysSchema } from "../zod";

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const appKeys = await getAppKeysFromSlug(config.slug);
  const { client_id } = zohoKeysSchema.parse(appKeys);

  const state = encodeOAuthState(req);

  const params = {
    client_id,
    response_type: "code",
    redirect_uri: WEBAPP_URL + "/api/integrations/zohocalendar/callback",
    scope: [
      "ZohoCalendar.calendar.ALL",
      "ZohoCalendar.event.ALL",
      "ZohoCalendar.freebusy.READ",
      "AaaServer.profile.READ",
    ],
    access_type: "offline",
    state,
    prompt: "consent",
  };

  const query = stringify(params);

  res.status(200).json({ url: `https://accounts.zoho.com/oauth/v2/auth?${query}` });
}

export default defaultHandler({
  GET: Promise.resolve({ default: defaultResponder(getHandler) }),
});