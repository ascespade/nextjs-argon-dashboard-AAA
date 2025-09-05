import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { email, full_name, role } = body;

    const { data, error } = await supabase
      .from('users_profiles')
      .update({
        email,
        full_name,
        role,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Get user profile to get user_id
    const { data: profile, error: profileError } = await supabase
      .from('users_profiles')
      .select('user_id')
      .eq('id', id)
      .single();

    if (profileError) throw profileError;

    // Delete from auth.users
    const { error: authError } = await supabase.auth.admin.deleteUser(profile.user_id);
    if (authError) throw authError;

    // Delete from users_profiles (should cascade from auth.users deletion)
    const { error: deleteError } = await supabase
      .from('users_profiles')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}