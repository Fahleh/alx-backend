#!/usr/bin/env python3
"""Module for Last-In First-Out caching method"""
from collections import OrderedDict

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """
    Represents a caching system with a LIFO
    removal method of operation.
    """

    def __init__(self):
        """Initializes the cache."""
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Adds an item to the cache."""
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                latest_key, _ = self.cache_data.popitem(True)
                print("DISCARD:", latest_key)
        self.cache_data[key] = item
        self.cache_data.move_to_end(key, last=True)

    def get(self, key):
        """Retrieves a cached item by it's key."""
        return self.cache_data.get(key, None)
