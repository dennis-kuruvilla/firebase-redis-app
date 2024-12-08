const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

exports.notifyProductViews = functions.firestore
  .document("users/{userId}/recentlyViewed/{docId}")
  .onCreate(async (snap, context) => {
    const { userId } = context.params;
    const { productId } = snap.data();

    try {
      const oneWeekAgo = admin.firestore.Timestamp
        .fromMillis(Date.now() - ONE_WEEK_MS);

      const viewsSnapshot = await db
        .collection(`users/${userId}/recentlyViewed`)
        .where("productId", "==", productId)
        .where("timestamp", ">", oneWeekAgo)
        .get();

      if (viewsSnapshot.size > 2) {
        await sendEmailNotification(userId, productId, viewsSnapshot.size);
        console.log
          (`Email notification sent to user ${userId} for product ${productId}`);
      }
    } catch (error) {
      console.error("Error in notifyProductViews function:", error.message);
    }
  });

async function sendEmailNotification(userId, productId, viewCount) {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    console.error(`User ${userId} not found`);
    return;
  }

  const userEmail = userDoc.data().email;
  if (!userEmail) {
    console.error(`User ${userId} does not have an email address`);
    return;
  }

  const emailPayload = {
    to: userEmail,
    template: {
      name: "product-view-notification",
      data: {
        productId,
        viewCount,
      },
    },
  };

  const emailCollection = admin.firestore().collection("mail");
  await emailCollection.add(emailPayload);

  console.log(`Email queued for user ${userId}`);
}
