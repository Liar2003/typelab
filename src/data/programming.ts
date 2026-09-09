export const programmingSnippets: Record<string, string[]> = {
  javascript: [
    `const users = await database
  .collection("users")
  .find({})
  .sort({ createdAt: -1 })
  .limit(10)
  .toArray();`,
    `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    `const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};`,
    `class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(...args));
    }
  }
}`,
    `const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
};`
  ],
  typescript: [
    `interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

const getUser = async (id: string): Promise<User | null> => {
  const user = await db.users.findById(id);
  return user ?? null;
};`,
    `type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return { success: false, error: new Error('Division by zero') };
  }
  return { success: true, data: a / b };
}`,
    `const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key)!;
  }) as T;
};`,
    `enum HttpStatus {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ServerError = 500,
}

const handleResponse = (status: HttpStatus) => {
  switch (status) {
    case HttpStatus.OK:
      return 'Success';
    case HttpStatus.NotFound:
      return 'Not Found';
    default:
      return 'Error';
  }
};`
  ],
  python: [
    `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`,
    `class DataPipeline:
    def __init__(self):
        self.steps = []
    
    def add_step(self, func):
        self.steps.append(func)
        return self
    
    def execute(self, data):
        result = data
        for step in self.steps:
            result = step(result)
        return result`,
    `from typing import List, Optional

def binary_search(arr: List[int], target: int) -> Optional[int]:
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return None`
  ],
  react: [
    `import { useState, useEffect, useCallback } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}`,
    `const MemoizedComponent = React.memo(({ data, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(data.id);
  }, [data.id, onSelect]);
  
  return (
    <div onClick={handleClick} className="p-4 hover:bg-gray-100">
      <h3>{data.title}</h3>
      <p>{data.description}</p>
    </div>
  );
});`
  ],
  sql: [
    `SELECT 
  u.id,
  u.name,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC;`,
    `WITH monthly_sales AS (
  SELECT 
    DATE_TRUNC('month', created_at) as month,
    SUM(amount) as revenue
  FROM transactions
  WHERE status = 'completed'
  GROUP BY 1
)
SELECT 
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) as prev_month,
  ROUND(
    (revenue - LAG(revenue) OVER (ORDER BY month)) / 
    LAG(revenue) OVER (ORDER BY month) * 100, 2
  ) as growth_pct
FROM monthly_sales;`
  ],
  css: [
    `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-in {
  animation: fadeIn 0.6s ease forwards;
}`
  ],
  html: [
    `<main class="container mx-auto px-4 py-8">
  <header class="mb-8">
    <h1 class="text-4xl font-bold text-gray-900">Dashboard</h1>
    <p class="mt-2 text-gray-600">Welcome back, user!</p>
  </header>
  
  <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <article class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-semibold">Total Users</h2>
      <p class="text-3xl font-bold text-blue-600">12,345</p>
    </article>
  </section>
</main>`
  ],
  bash: [
    `#!/bin/bash
set -euo pipefail

deploy() {
  local env=$1
  echo "Deploying to $env..."
  
  docker build -t app:$env .
  docker run -d --name app-$env -p 3000:3000 app:$env
  
  echo "Deployment complete!"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -e|--env) ENV="$2"; shift 2;;
    *) echo "Unknown option"; exit 1;;
  esac
done

deploy $ENV`
  ],
  php: [
    `<?php
class Database {
    private static ?PDO $instance = null;
    
    public static function getInstance(): PDO {
        if (self::$instance === null) {
            $dsn = 'mysql:host=localhost;dbname=app;charset=utf8mb4';
            self::$instance = new PDO($dsn, 'user', 'pass', [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        }
        return self::$instance;
    }
}

function processUser(array $data): array {
    $validated = array_filter($data, fn($v) => !empty($v));
    return array_map('htmlspecialchars', $validated);
}
?>`
  ],
  java: [
    `public class LinkedList<T> {
    private Node<T> head;
    private int size;
    
    private static class Node<T> {
        T data;
        Node<T> next;
        
        Node(T data) {
            this.data = data;
            this.next = null;
        }
    }
    
    public void add(T item) {
        Node<T> newNode = new Node<>(item);
        newNode.next = head;
        head = newNode;
        size++;
    }
    
    public T remove() {
        if (head == null) throw new NoSuchElementException();
        T data = head.data;
        head = head.next;
        size--;
        return data;
    }
}`
  ],
  go: [
    `package main

import (
    "fmt"
    "sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\\n", id, job)
        results <- job * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    var wg sync.WaitGroup
    
    for w := 1; w <= 3; w++ {
        wg.Add(1)
        go worker(w, jobs, results, &wg)
    }
    
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)
    
    wg.Wait()
    close(results)
}`
  ],
  rust: [
    `use std::collections::HashMap;

fn count_words(text: &str) -> HashMap<&str, usize> {
    let mut word_counts = HashMap::new();
    
    for word in text.split_whitespace() {
        let count = word_counts.entry(word).or_insert(0);
        *count += 1;
    }
    
    word_counts
}

fn main() {
    let text = "hello world hello rust";
    let counts = count_words(text);
    
    for (word, count) in &counts {
        println!("{}: {}", word, count);
    }
}`
  ],
  csharp: [
    `public class Repository<T> where T : class {
    private readonly DbContext _context;
    
    public Repository(DbContext context) {
        _context = context;
    }
    
    public async Task<T?> GetByIdAsync(int id) {
        return await _context.Set<T>().FindAsync(id);
    }
    
    public async Task<IEnumerable<T>> GetAllAsync() {
        return await _context.Set<T>().ToListAsync();
    }
    
    public async Task<T> AddAsync(T entity) {
        await _context.Set<T>().AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }
}`
  ],
  cplus: [
    `#include <iostream>
#include <vector>
#include <algorithm>

template<typename T>
class Stack {
private:
    std::vector<T> elements;
    
public:
    void push(const T& elem) {
        elements.push_back(elem);
    }
    
    T pop() {
        if (elements.empty()) throw std::runtime_error("Empty stack");
        T elem = elements.back();
        elements.pop_back();
        return elem;
    }
    
    bool empty() const {
        return elements.empty();
    }
    
    size_t size() const {
        return elements.size();
    }
};`
  ]
};
