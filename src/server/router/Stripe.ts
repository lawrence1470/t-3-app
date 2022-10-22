import {createRouter} from './context';
import {z} from 'zod';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET, {apiVersion: '2022-08-01'});
import clerk from '@clerk/clerk-sdk-node';
import * as trpc from '@trpc/server';

export const stripeRouter = createRouter()
  .mutation('createConnectedAccount', {
    async resolve({ctx}) {
      const userId = ctx.req?.auth?.userId;
      const orgId = ctx.req?.auth?.claims.org_id;

      const account = await stripe.accounts.create({type: 'express'});

      await clerk.organizations.updateOrganizationMetadata(orgId!, {
        privateMetadata: {
          stripeAccountId: account.id,
        },
      });

      await clerk.users.updateUser(userId!, {
        privateMetadata: {
          stripeAccountId: account.id,
        },
      });

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'http://localhost:3000/landlord/properties',
        return_url: 'http://localhost:3000/landlord/properties',
        type: 'account_onboarding',
      });

      return accountLink;
    },
  })
  .mutation('getConnectedAccount', {
    async resolve({ctx}) {
      const userId = ctx.req?.auth?.userId;

      const user = await clerk.users.getUser(userId!);

      const accountId = user.privateMetadata.stripeAccountId;

      if (typeof accountId !== 'string') {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `something went wrong`,
        });
      }

      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: 'http://localhost:3000/landlord/banking',
        return_url: 'http://localhost:3000/landlord/banking',
        type: 'account_update',
      });

      return accountLink;
    },
  })
  .mutation('payRent', {
    async resolve({ctx}) {
      const userId = ctx.req?.auth?.userId;

      const orgId = ctx.req?.auth?.claims.org_id;

      if (typeof orgId !== 'string') {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `Could not find org id`,
        });
      }

      const org = await clerk.organizations.getOrganization({
        organizationId: orgId,
      });

      const accountId = org.privateMetadata.stripeAccountId;

      if (typeof accountId !== 'string') {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `something went wrong`,
        });
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: 2000,
              product_data: {
                name: 'T-shirt',
                description: 'Comfortable cotton t-shirt',
                images: ['https://example.com/t-shirt.png'],
              },
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: 7,
          transfer_data: {
            destination: accountId,
          },
        },
        mode: 'payment',
        success_url: 'http://localhost:3000/tenant/dashboard',
        cancel_url: 'http://localhost:3000/tenant/dashboard',
      });

      return session;
    },
  })
  .query('getConnectedAccount', {
    async resolve({ctx}) {
      const userId = ctx.req?.auth?.userId;

      const user = await clerk.users.getUser(userId!);

      const accountId = user.privateMetadata.stripeAccountId;

      if (typeof accountId !== 'string') {
        return {stripeAccount: null, balance: null};
      }

      const stripAccount = await stripe.accounts.retrieve(accountId);

      const accountBalance = await stripe.balance.retrieve({
        stripeAccount: accountId,
      });

      let availableBalance = null;
      let pendingBalance = null;

      if (accountBalance.available.length > 0) {
        availableBalance = accountBalance.available[0]!.amount;
      }

      if (accountBalance.pending.length > 0) {
        pendingBalance = accountBalance.pending[0]!.amount;
      }

      return {stripAccount, availableBalance, pendingBalance};
    },
  });
