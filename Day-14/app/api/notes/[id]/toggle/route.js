import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../lib/mongodb';
import { getCurrentUser } from '../../../../../lib/auth';

// PATCH toggle note completion
export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid note ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('taniyaa');
    const notes = db.collection('notes');

    // First get the current note to toggle its completion status
    const currentNote = await notes.findOne({
      _id: new ObjectId(id),
      userId: user.userId
    });

    if (!currentNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Toggle the completion status
    const updatedNote = await notes.findOneAndUpdate(
      { _id: new ObjectId(id), userId: user.userId },
      {
        $set: {
          isCompleted: !currentNote.isCompleted,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    return NextResponse.json(updatedNote.value);
  } catch (error) {
    console.error('Error toggling note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
