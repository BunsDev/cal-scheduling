import { test } from "../../lib/fixtures";
import { initialCommonSteps } from "../utils/bookingUtils";

test.describe.configure({ mode: "parallel" });

test.afterEach(({ users }) => users.deleteAll());

test.describe("Booking With Phone Question and Multi email Question", () => {
  const bookingOptions = {
    hasPlaceholder: true,
    isRequired: true,
    isMultiEmails: true,
  };
  test("Phone and Multi email required", async ({ page, users }) => {
    await initialCommonSteps(
      page,
      "phone",
      users,
      "multiemail",
      "Test Phone question and Multi email question (both required)",
      bookingOptions
    );
  });

  test("Phone and Multi email not required", async ({ page, users }) => {
    await initialCommonSteps(
      page,
      "phone",
      users,
      "multiemail",
      "Test Phone question and Multi email question (only phone required)",
      { ...bookingOptions, isRequired: false }
    );
  });
});
