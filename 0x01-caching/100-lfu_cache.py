#!/usr/bin/env python3
"""Module for Least Frequently Used caching method."""
from collections import OrderedDict

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """
    Represents a caching system with a LFU
    removal method of operation.
    """

    def __init__(self):
        """Initializes the cache."""
        super().__init__()
        self.cache_data = OrderedDict()
        self.keys_freq = []

    def __reorder_items(self, mru_key):
        """
        Reorders the cache items in tthe order of most
        recently used.
        """
        position_max = []
        used_freq = 0
        position_mru = 0
        position_ins = 0
        for i, key_freq in enumerate(self.keys_freq):
            if key_freq[0] == mru_key:
                used_freq = key_freq[1] + 1
                position_mru = i
                break
            elif len(position_max) == 0:
                position_max.append(i)
            elif key_freq[1] < self.keys_freq[position_max[-1]][1]:
                position_max.append(i)
        position_max.reverse()
        for position in position_max:
            if self.keys_freq[position][1] > used_freq:
                break
            position_ins = position
        self.keys_freq.pop(position_mru)
        self.keys_freq.insert(position_ins, [mru_key, used_freq])

    def put(self, key, item):
        """Adds an item in the cache."""
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                least_used, _ = self.keys_freq[-1]
                self.cache_data.pop(least_used)
                self.keys_freq.pop()
                print("DISCARD:", least_used)
            self.cache_data[key] = item
            req_idx = len(self.keys_freq)
            for i, key_freq in enumerate(self.keys_freq):
                if key_freq[1] == 0:
                    req_idx = i
                    break
            self.keys_freq.insert(req_idx, [key, 0])
        else:
            self.cache_data[key] = item
            self.__reorder_items(key)

    def get(self, key):
        """Retrieves a cached item by it's key."""
        if key is not None and key in self.cache_data:
            self.__reorder_items(key)
        return self.cache_data.get(key, None)
