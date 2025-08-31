import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const { email, password, confirmPassword, username, name } = await request.json();

    // Validation
    if (!email || !password || !confirmPassword || !username || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('taniyaa');
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = await users.insertOne({
      email,
      password: hashedPassword,
      username,
      name,
      createdAt: new Date()
    });

    return NextResponse.json(
      { message: 'User registered successfully', userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
