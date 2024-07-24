#!/usr/bin/env python3
"""Module for Most Recently Used caching method."""
from collections import OrderedDict

from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """
    Represents a caching system with a MRU
    removal method of operation.
    """

    def __init__(self):
        """Initializes the cache."""
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Adds an item in the cache."""
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                most_recent, _ = self.cache_data.popitem(False)
                print("DISCARD:", most_recent)
            self.cache_data[key] = item
            self.cache_data.move_to_end(key, last=False)
        else:
            self.cache_data[key] = item

    def get(self, key):
        """Retrieves a cached item by it's key."""
        if key is not None and key in self.cache_data:
            self.cache_data.move_to_end(key, last=False)
        return self.cache_data.get(key, None)
