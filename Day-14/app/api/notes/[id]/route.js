import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';
import { getCurrentUser } from '../../../../lib/auth';

// PUT update note
export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { title, content, category, priority, isCompleted } = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid note ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('taniyaa');
    const notes = db.collection('notes');

    const updateData = {
      title,
      content,
      category,
      priority,
      isCompleted,
      updatedAt: new Date()
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key =>
      updateData[key] === undefined && delete updateData[key]
    );

    const updatedNote = await notes.findOneAndUpdate(
      { _id: new ObjectId(id), userId: user.userId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!updatedNote.value) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedNote.value);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE note
export async function DELETE(request, { params }) {
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

    const deletedNote = await notes.findOneAndDelete({
      _id: new ObjectId(id),
      userId: user.userId
    });

    if (!deletedNote.value) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Note deleted successfully',
      deletedNote: deletedNote.value
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
