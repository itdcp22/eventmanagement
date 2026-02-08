<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MenuItem::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->boolean('available_only', false)) {
            $query->where('is_available', true);
        }

        $items = $query->orderBy('category')->orderBy('name')->get();

        return response()->json($items);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'category' => 'required|in:appetizer,main_course,dessert,beverage,side',
            'is_available' => 'boolean',
        ]);

        $item = MenuItem::create($validated);

        return response()->json($item, 201);
    }

    public function show(MenuItem $menuItem): JsonResponse
    {
        return response()->json($menuItem);
    }

    public function update(Request $request, MenuItem $menuItem): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'sometimes|numeric|min:0',
            'category' => 'sometimes|in:appetizer,main_course,dessert,beverage,side',
            'is_available' => 'boolean',
        ]);

        $menuItem->update($validated);

        return response()->json($menuItem);
    }

    public function destroy(MenuItem $menuItem): JsonResponse
    {
        $menuItem->delete();

        return response()->json(null, 204);
    }
}
