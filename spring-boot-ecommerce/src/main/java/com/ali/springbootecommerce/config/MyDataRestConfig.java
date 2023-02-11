package com.ali.springbootecommerce.config;

import com.ali.springbootecommerce.entity.Product;
import com.ali.springbootecommerce.entity.ProductCategory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnSupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions)))
                .withCollectionExposure(((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions)));

        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions)))
                .withCollectionExposure(((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions)));
        exposeId(config);
   
    }

    private void exposeId(RepositoryRestConfiguration config) {
        //tum entityleri listeye alcaz entitymanagerden
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        List<Class> entityClasses = new ArrayList<>();

        for (EntityType item : entities){
            entityClasses.add(item.getJavaType());
            System.out.println(item.getName());//ProductCategory, Product
        }
        Class[] domainTypes = entityClasses.toArray(new Class[0]); //We need to convert the ArrayList to an array of Class objects
        //Class[0], we are telling the arraylist to convert to an array of Class[]. We make use of Class[0] for efficiency purposes
        System.out.println(domainTypes[0]);//class com.ali.springbootecommerce.entity.ProductCategory
        System.out.println(domainTypes[1]);//class com.ali.springbootecommerce.entity.Product
        config.exposeIdsFor(domainTypes); //idsini ekledik api'ye hem product'in hem productcategorinin


    }
}
