import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { getCurrentUser } from '../../../lib/auth';

// GET all notes for the authenticated user
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('taniyaa');
    const notes = db.collection('notes');

    const userNotes = await notes
      .find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(userNotes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new note
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { title, content, category, priority } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('taniyaa');
    const notes = db.collection('notes');

    const newNote = {
      title: title.trim(),
      content: content.trim(),
      category: category || 'General',
      priority: priority || 'Medium',
      isCompleted: false,
      userId: user.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await notes.insertOne(newNote);
    const savedNote = { ...newNote, _id: result.insertedId };

    return NextResponse.json(savedNote, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
