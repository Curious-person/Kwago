'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function ProductsDebugPage() {
    const [results, setResults] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const addResult = (message: string) => {
        setResults(prev => [...prev, message]);
    };

    const runDiagnostics = async () => {
        setIsRunning(true);
        setResults([]);

        addResult('=== Products Table Diagnostic ===\n');

        const supabase = createClient();

        // Check 1: Authentication
        addResult('1. Checking authentication...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            addResult(`❌ Authentication failed: ${authError?.message || 'No user'}`);
            setIsRunning(false);
            return;
        }
        addResult(`✅ Connected as: ${user.email}`);
        addResult(`   User ID: ${user.id}\n`);

        // Check 2: Table exists
        addResult('2. Checking if products table exists...');
        const { error: tableError } = await supabase
            .from('products')
            .select('*')
            .limit(0);

        if (tableError) {
            addResult(`❌ Table check failed: ${tableError.message}`);
            addResult(`   Code: ${tableError.code}`);
            addResult(`   Details: ${tableError.details}`);
            addResult(`   Hint: ${tableError.hint}`);
            addResult('\n⚠️  The products table likely does not exist!');
            addResult('   Please run: database/products_schema.sql in Supabase SQL Editor\n');
            setIsRunning(false);
            return;
        }
        addResult('✅ Products table exists\n');

        // Check 3: Read permissions
        addResult('3. Checking read permissions...');
        const { data: products, error: readError } = await supabase
            .from('products')
            .select('*');

        if (readError) {
            addResult(`❌ Read failed: ${readError.message}`);
            addResult(`   Code: ${readError.code}\n`);
            setIsRunning(false);
            return;
        }
        addResult(`✅ Can read from products table`);
        addResult(`   Found ${products?.length || 0} products\n`);

        // Check 4: Insert test
        addResult('4. Testing insert permissions...');
        const testProduct = {
            name: 'Test Product - DELETE ME',
            price: 9.99,
            condition: 'New',
            image: 'https://via.placeholder.com/400',
            description: 'Diagnostic test product',
            author_id: user.id,
        };

        addResult(`   Attempting to insert: ${JSON.stringify(testProduct, null, 2)}`);

        const { data: insertedProduct, error: insertError } = await supabase
            .from('products')
            .insert(testProduct)
            .select()
            .single();

        if (insertError) {
            addResult(`❌ Insert failed: ${insertError.message}`);
            addResult(`   Code: ${insertError.code}`);
            addResult(`   Details: ${insertError.details}`);
            addResult(`   Hint: ${insertError.hint}\n`);
            setIsRunning(false);
            return;
        }
        addResult(`✅ Successfully inserted test product`);
        addResult(`   Product ID: ${insertedProduct?.id}\n`);

        // Check 5: Cleanup
        addResult('5. Cleaning up test product...');
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id', insertedProduct.id);

        if (deleteError) {
            addResult(`❌ Delete failed: ${deleteError.message}`);
            addResult(`   Please manually delete product ID: ${insertedProduct.id}\n`);
            setIsRunning(false);
            return;
        }
        addResult('✅ Test product deleted\n');

        addResult('=== All checks passed! ===');
        addResult('The products table is properly configured.');
        setIsRunning(false);
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">Products Table Diagnostics</h1>
                <p className="text-zinc-500">
                    This page helps diagnose issues with the products table setup.
                </p>
            </div>

            <div className="mb-6">
                <Button onClick={runDiagnostics} disabled={isRunning}>
                    {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
                </Button>
            </div>

            {results.length > 0 && (
                <div className="bg-zinc-900 text-zinc-100 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                    {results.map((result, index) => (
                        <div key={index} className="whitespace-pre-wrap">
                            {result}
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h2 className="text-lg font-bold text-blue-900 mb-3">Common Issues & Solutions</h2>
                <div className="space-y-4 text-sm text-blue-800">
                    <div>
                        <strong>❌ Table check failed:</strong>
                        <p className="mt-1">
                            The products table doesn't exist. Run <code className="bg-blue-100 px-2 py-1 rounded">database/products_schema.sql</code> in Supabase SQL Editor.
                        </p>
                    </div>
                    <div>
                        <strong>❌ Insert failed (RLS policy):</strong>
                        <p className="mt-1">
                            Row Level Security policies are not configured correctly. Make sure the schema file was run completely.
                        </p>
                    </div>
                    <div>
                        <strong>❌ Authentication failed:</strong>
                        <p className="mt-1">
                            You're not logged in or your session expired. Log in again and retry.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
