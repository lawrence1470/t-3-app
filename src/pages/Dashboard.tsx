// pages/organizations/[id].ts
import { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import type { OrganizationMembershipResource } from "@clerk/types";
import Router from 'next/router'


// View and manage active organization members, along with any
// pending invitations.
// Invite new members.
export default function Dashboard() {
    const {
        organization: currentOrganization,
        membership,
        isLoaded,
    } = useOrganization();

    console.log('here', currentOrganization)
    if (!isLoaded || !currentOrganization) {
      return Router.push('/new')
    }

    const isAdmin = (membership as any).role === "admin";
    console.log(isAdmin, 'isadmin')
    return (
        <>
            <h1>Organization: {currentOrganization.name}</h1>
            {/*<MemberList />*/}
            {/*{isAdmin && <InvitationList />}*/}
        </>
    );
}
