// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const discounts = [];

  input?.cart?.lines?.forEach((line) => {
    const { id, quantity, merchandise } = line;

    // Check if product has inclusion tags
    if (merchandise?.product?.hasAnyTag) {
      let discountMessage = "";
      let discountValue = 0;

      // Determine discount value and message based on quantity
      if (quantity >= 6) {
        discountMessage = "25% volume discount";
        discountValue = 0.15;
      } else if (quantity >= 4) {
        discountMessage = "20% volume discount";
        discountValue = 0.10;
      } else if (quantity >= 2) {
        discountMessage = "15% volume discount";
        discountValue = 0.05;
      }      

      // If a valid discount applies, add it to the discounts array
      if (discountValue > 0) {
        discounts.push({
          message: discountMessage,
          targets: [
            /** @type {Target} */ ({
              cartLine: { 
                id: line.id 
              },
            }),
          ],
          value: {
            percentage: {
              value: (discountValue * 100).toString(),
            },
          },
        });
      }
    }
  });

  return discounts.length > 0
    ? {
        discountApplicationStrategy: DiscountApplicationStrategy.Maximum,
        discounts,
      }
    : EMPTY_DISCOUNT;
}
