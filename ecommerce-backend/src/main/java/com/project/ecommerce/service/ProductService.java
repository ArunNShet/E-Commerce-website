package com.project.ecommerce.service;

import com.project.ecommerce.dto.CreateProductRequest;
import com.project.ecommerce.dto.ProductResponse;
import com.project.ecommerce.dto.UpdateProductRequest;
import com.project.ecommerce.model.Category;
import com.project.ecommerce.exception.ResourceNotFoundException;
import com.project.ecommerce.model.Product;
import com.project.ecommerce.model.ProductStatus;
import com.project.ecommerce.repository.CategoryRepository;
import com.project.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public ProductResponse create(CreateProductRequest request) {
        Product product = new Product();
        product.setName(request.name());
        product.setWeight(request.weight());
        product.setDescription(request.description());
        product.setCategory(resolveCategory(request.categoryName()));
        product.setImageUrl(request.imageUrl());
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setStatus(request.stock() > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK);
        return toResponse(productRepository.save(product));
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findAll(String name) {
        if (name != null && !name.isBlank()) {
            return productRepository.findByNameContainingIgnoreCase(name)
                    .stream()
                    .map(this::toResponse)
                    .toList();
        }

        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return toResponse(getById(id));
    }

    public ProductResponse update(Long id, UpdateProductRequest request) {
        Product product = getById(id);
        product.setName(request.name());
        product.setWeight(request.weight());
        product.setDescription(request.description());
        product.setCategory(resolveCategory(request.categoryName()));
        product.setImageUrl(request.imageUrl());
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setStatus(request.stock() > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK);
        return toResponse(productRepository.save(product));
    }

    public void delete(Long id) {
        Product product = getById(id);
        productRepository.delete(product);
    }

    private Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getWeight(),
                product.getDescription(),
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getImageUrl(),
                product.getPrice(),
                product.getStock(),
                product.getStatus(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }

    private Category resolveCategory(String categoryName) {
        if (categoryName == null || categoryName.isBlank()) {
            return null;
        }

        return categoryRepository.findByNameIgnoreCase(categoryName.trim())
                .orElseGet(() -> {
                    Category category = new Category();
                    category.setName(categoryName.trim());
                    category.setDescription(categoryName.trim() + " category");
                    return categoryRepository.save(category);
                });
    }
}
