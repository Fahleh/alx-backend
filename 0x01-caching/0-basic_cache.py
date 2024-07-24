#!/usr/bin/env python3
"""Module for Base caching."""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """Cashing class for storing and retrieving items from a dictionary."""

    def put(self, key, item):
        """Adds an item to the cache."""
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """Retrieves a cached item by it's key."""
        return self.cache_data.get(key, None)
