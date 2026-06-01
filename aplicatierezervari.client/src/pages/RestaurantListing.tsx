import * as React from 'react';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { RestaurantDto } from '../types/index';
import { apiService } from '../services/api';

interface RestaurantListingProps {
    viewType: 'Book a table' | 'Plan your event';
}