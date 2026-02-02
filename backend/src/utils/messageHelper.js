const updateConversationAfterCreateMessage = (
  conversation,
  message,
  senderId,
) => {
  conversation.set({
    seenBy: [],
    lastMessageAt: message.createdAt,
    lastMessage: {
      _id: message._id,
      content: message.content,
      senderId: senderId,
      createdAt: message.createdAt,
    },
  });

  conversation.participants.forEach((participant) => {
    console.log("Updating unread count for participant:", participant);
    console.log("Participant details:", participant.userId);
    const memberId = participant.userId.toString();
    console.log("Member ID:", memberId);
    const isSender = memberId === senderId.toString();
    console.log("Is sender:", isSender);
    const prevCount = conversation.unReadCounts.get(memberId) || 0;
    conversation.unReadCounts.set(memberId, isSender ? 0 : prevCount + 1);
  });
};

export { updateConversationAfterCreateMessage };
