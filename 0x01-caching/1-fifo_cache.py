#!/usr/bin/env python3
"""Module for First-In First-Out caching method."""
from collections import OrderedDict

from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """
    Represents a caching system with a FIFO
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
        self.cache_data[key] = item
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            first, _ = self.cache_data.popitem(False)
            print("DISCARD:", first)

    def get(self, key):
        """Retrieves a cached item by it's key."""
        return self.cache_data.get(key, None)
