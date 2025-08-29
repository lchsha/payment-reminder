import { and, eq, gt, gte, ne } from "drizzle-orm";

import db from "~/lib/db";
import { group } from "~/lib/db/schema/group";
import { groupMember } from "~/lib/db/schema/group-member";
import { user } from "~/lib/db/schema/user";

export default defineEventHandler(async (e) => {
  const { groupId } = getQuery(e);
  const members = await db.select({
    memberId: groupMember.id,
    name: user.name,
    username: user.username,
    userId: user.id,
    photoUrl: user.photoUrl,
  })
    .from(groupMember)
    .innerJoin(user, eq(groupMember.userId, user.id))
    .innerJoin(group, eq(group.id, Number(groupId)))
    .where(eq(groupMember.groupId, Number(groupId)));
    // .where(and(eq(groupMember.groupId, Number(groupId)), ne(group.creatorId, user.id)));
  return members;
});
